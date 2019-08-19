import get from 'lodash/get'
import { createSelector } from 'reselect'
import { grpc } from 'workers'
import { getIntl } from '@zap/i18n'
import { openModal, closeModal } from './modal'
import { settingsSelectors } from './settings'
import { showError } from './notification'
import createReducer from './utils/createReducer'
import messages from './messages'
// ------------------------------------
// Initial State
// ------------------------------------

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

// ------------------------------------
// Constants
// ------------------------------------

export const FETCH_ADDRESSES = 'FETCH_ADDRESSES'
export const FETCH_ADDRESSES_SUCCESS = 'FETCH_ADDRESSES_SUCCESS'
export const FETCH_ADDRESSES_FAILURE = 'FETCH_ADDRESSES_FAILURE'
export const NEW_ADDRESS = 'NEW_ADDRESS'
export const NEW_ADDRESS_SUCCESS = 'NEW_ADDRESS_SUCCESS'
export const NEW_ADDRESS_FAILURE = 'NEW_ADDRESS_FAILURE'

// LND expects types to be sent as int, so this object will allow mapping from string to int
const ADDRESS_TYPES = {
  p2wkh: 0,
  np2wkh: 1,
}

// ------------------------------------
// Actions
// ------------------------------------

export const openWalletModal = () => dispatch => dispatch(openModal('RECEIVE_MODAL'))
export const closeWalletModal = () => dispatch => dispatch(closeModal('RECEIVE_MODAL'))

/**
 * initAddresses - Initialise addresses.
 *
 * @returns {Function} Thunk
 */
export const initAddresses = () => async (dispatch, getState) => {
  try {
    dispatch({ type: FETCH_ADDRESSES })

    const state = getState()

    // Get node information (addresses are keyed under the node pubkey).
    const pubKey = state.info.data.identity_pubkey
    const node = await window.db.nodes.get({ id: pubKey })

    // Get existing addresses for the node.
    const addresses = get(node, 'addresses', {})
    dispatch({ type: FETCH_ADDRESSES_SUCCESS, addresses })

    // Ensure that we have an address for all supported address types.
    await Promise.all(
      Object.keys(ADDRESS_TYPES).map(type => {
        if (!addresses[type]) {
          return dispatch(newAddress(type))
        }
      })
    )
  } catch (error) {
    dispatch({ type: FETCH_ADDRESSES_FAILURE, error: error.message })
  }
}

/**
 * newAddress - Generate a new address and sets it as wallet current.
 *
 * @param {('p2wkh'|'np2wkh')} addressType Address type
 * @returns {Function} Thunk
 */
export const newAddress = addressType => async dispatch => {
  dispatch({ type: NEW_ADDRESS, addressType })
  try {
    const data = await createNewAddress(addressType)
    await dispatch(newAddressSuccess(addressType, data.address))
  } catch (error) {
    dispatch(newAddressFailure(addressType, error.message))
  }
}

/**
 * createNewAddress - Creates a new address.
 *
 * @param {('p2wkh'|'np2wkh'|null)} addressType Address type. If not specified uses current saved config setting.
 * @returns {Promise<string>} Generated address
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
 * newAddressSuccess - Generate new address success callback.
 *
 * @param {string} addressType Address type
 * @param {string} address Address
 * @returns {Function} Thunk
 */
export const newAddressSuccess = (addressType, address) => async (dispatch, getState) => {
  const state = getState()
  const pubKey = state.info.data.identity_pubkey

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
 * newAddressFailure - Generate new address failure callback.
 *
 * @param {string} addressType Address type
 * @param {string} error Error message
 * @returns {Function} Thunk
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

// ------------------------------------
// Selectors
// ------------------------------------

const addressSelectors = {}

addressSelectors.addressesLoading = state => state.address.addressesLoading
addressSelectors.currentAddresses = state => state.address.addresses
addressSelectors.currentConfig = state => settingsSelectors.currentConfig(state)
addressSelectors.currentAddress = createSelector(
  addressSelectors.currentAddresses,
  addressSelectors.currentConfig,
  (currentAddresses, currentConfig) => currentAddresses[currentConfig.address]
)
addressSelectors.isAddressLoading = createSelector(
  addressSelectors.addressesLoading,
  addressSelectors.currentConfig,
  (addressesLoading, currentConfig) => addressesLoading[currentConfig.address]
)

export { addressSelectors }

export default createReducer(initialState, ACTION_HANDLERS)
