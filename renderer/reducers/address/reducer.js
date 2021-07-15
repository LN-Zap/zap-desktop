import get from 'lodash/get'

import { getIntl } from '@zap/i18n'
import createReducer from '@zap/utils/createReducer'
import { openModal, closeModal } from 'reducers/modal'
import { showError } from 'reducers/notification'
import { settingsSelectors } from 'reducers/settings'
import { grpc } from 'workers'

import messages from '../messages'
import * as constants from './constants'

const {
  FETCH_ADDRESSES,
  FETCH_ADDRESSES_SUCCESS,
  FETCH_ADDRESSES_FAILURE,
  NEW_ADDRESS,
  NEW_ADDRESS_SUCCESS,
  NEW_ADDRESS_FAILURE,
} = constants

// ------------------------------------
// Initial State
// ------------------------------------

/**
 * @typedef State
 * @property {boolean} isAddressLoading Boolean indicating if addresses are loading.
 * @property {Error|null} fetchAddressError Error from loading addresses.
 * @property {{np2wkh: boolean, p2wkh: boolean}} addressesLoading Booleans indicating address types that are loading.
 * @property {{np2wkh: string|null, p2wkh: string|null}} addresses Current bitcoin addresses.
 */

/** @type {State} */
const initialState = {
  isAddressLoading: false,
  fetchAddressError: null,
  addressesLoading: {
    np2wkh: false,
    p2wkh: false,
  },
  addresses: {
    np2wkh: null,
    p2wkh: null,
  },
}

// LND expects types to be sent as int, so this object will allow mapping from string to int
const ADDRESS_TYPES = {
  p2wkh: 0,
  np2wkh: 1,
}

// ------------------------------------
// Actions
// ------------------------------------

/**
 * openWalletModal - Open wallet modal.
 *
 * @returns {(dispatch:Function) => void} Thunk
 */
export const openWalletModal = () => dispatch => dispatch(openModal('RECEIVE_MODAL'))

/**
 * closeWalletModal - Close wallet modal.
 *
 * @returns {(dispatch:Function) => void} Thunk
 */
export const closeWalletModal = () => dispatch => dispatch(closeModal('RECEIVE_MODAL'))

/**
 * newAddressSuccess - Generate new address success callback.
 *
 * @param {string} addressType Address type
 * @param {string} address Address
 * @returns {(dispatch:Function, getState:Function) => Promise<void>} Thunk
 */
export const newAddressSuccess = (addressType, address) => async (dispatch, getState) => {
  const state = getState()
  const pubKey = state.info.data.identityPubkey

  // If we know the node's public key, store the address for reuse.
  if (pubKey) {
    const node = await window.db.nodes.get(pubKey)
    if (node) {
      node.setCurrentAddress(addressType, address)
      await window.db.nodes.put(node)
    } else {
      await window.db.nodes.put({ id: pubKey, addresses: { [addressType]: address } })
    }
  }

  dispatch({ type: NEW_ADDRESS_SUCCESS, addressType, address })
}

/**
 * createNewAddress - Creates a new address.
 *
 * @param {('p2wkh'|'np2wkh'|null)} addressType Address type. If not specified uses current saved config setting.
 * @returns {(dispatch:Function, getState:Function) => Promise<string>} Thunk
 */
export const createNewAddress = addressType => async (dispatch, getState) => {
  const getConfigAddressType = () => {
    const settings = settingsSelectors.currentConfig(getState())
    return settings && settings.address
  }
  const type = addressType || getConfigAddressType()
  const data = await grpc.services.Lightning.newAddress({ type: ADDRESS_TYPES[type] })
  return data.address
}

/**
 * newAddressFailure - Generate new address failure callback.
 *
 * @param {string} addressType Address type
 * @param {string} error Error message
 * @returns {(dispatch:Function) => void} Thunk
 */
export const newAddressFailure = (addressType, error) => dispatch => {
  const intl = getIntl()
  dispatch(
    showError(intl.formatMessage(messages.address_new_address_error, { addressType, error }))
  )
  dispatch({
    type: NEW_ADDRESS_FAILURE,
    addressType,
    error,
  })
}

/**
 * newAddress - Generate a new address and sets it as wallet current.
 *
 * @param {('p2wkh'|'np2wkh')} addressType Address type
 * @returns {(dispatch:Function) => Promise<string>} Thunk
 */
export const newAddress = addressType => async dispatch => {
  dispatch({ type: NEW_ADDRESS, addressType })
  try {
    const address = await dispatch(createNewAddress(addressType))
    await dispatch(newAddressSuccess(addressType, address))
    return address
  } catch (error) {
    dispatch(newAddressFailure(addressType, error.message))
    return null
  }
}

/**
 * initAddresses - Initialise addresses.
 *
 * @returns {(dispatch:Function, getState:Function) => Promise<void>} Thunk
 */
export const initAddresses = () => async (dispatch, getState) => {
  try {
    dispatch({ type: FETCH_ADDRESSES })

    const state = getState()

    // Get node information (addresses are keyed under the node pubkey).
    const pubKey = state.info.data.identityPubkey
    const node = await window.db.nodes.get({ id: pubKey })

    // Get existing addresses for the node.
    const addresses = get(node, 'addresses', {})

    // Ensure that we have an address for all supported address types.
    const fetchAddresses = async types => {
      const data = {}
      await Promise.all(
        types.map(async type => {
          data[type] = addresses[type] || (await dispatch(newAddress(type)))
        })
      )
      return data
    }

    const allAddresses = await fetchAddresses(Object.keys(ADDRESS_TYPES))

    dispatch({ type: FETCH_ADDRESSES_SUCCESS, addresses: allAddresses })
  } catch (error) {
    dispatch({ type: FETCH_ADDRESSES_FAILURE, error: error.message })
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------

const ACTION_HANDLERS = {
  [FETCH_ADDRESSES]: state => {
    state.isAddressLoading = true
  },
  [FETCH_ADDRESSES_SUCCESS]: (state, { addresses }) => {
    state.addresses = addresses
    state.isAddressLoading = false
    state.fetchAddressError = null
  },
  [FETCH_ADDRESSES_FAILURE]: (state, { error }) => {
    state.isAddressLoading = false
    state.fetchAddressError = error
  },
  [NEW_ADDRESS]: (state, { addressType }) => {
    state.addressesLoading[addressType] = true
  },
  [NEW_ADDRESS_SUCCESS]: (state, { addressType, address }) => {
    state.addressesLoading[addressType] = false
    state.addresses[addressType] = address
  },
  [NEW_ADDRESS_FAILURE]: (state, { addressType }) => {
    state.addressesLoading[addressType] = false
  },
}

export default createReducer(initialState, ACTION_HANDLERS)
