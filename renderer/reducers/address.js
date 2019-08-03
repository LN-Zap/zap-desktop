import get from 'lodash/get'
import { createSelector } from 'reselect'
import { grpc } from 'workers'
import { openModal, closeModal } from './modal'
import { settingsSelectors } from './settings'
import { showError } from './notification'
import createReducer from './utils/createReducer'

// ------------------------------------
// Initial State
// ------------------------------------

const initialState = {
  addressesLoading: {
    np2wkh: false,
    p2wkh: false,
  },
  addresses: {
    np2wkh: null,
    p2wkh: null,
  },
  walletModal: false,
}

// ------------------------------------
// Constants
// ------------------------------------

export const FETCH_ADDRESSES = 'FETCH_ADDRESSES'
export const FETCH_ADDRESSES_SUCCESS = 'FETCH_ADDRESSES_SUCCESS'
export const NEW_ADDRESS = 'NEW_ADDRESS'
export const NEW_ADDRESS_SUCCESS = 'NEW_ADDRESS_SUCCESS'
export const NEW_ADDRESS_FAILURE = 'NEW_ADDRESS_FAILURE'
export const OPEN_WALLET_MODAL = 'OPEN_WALLET_MODAL'
export const CLOSE_WALLET_MODAL = 'CLOSE_WALLET_MODAL'

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
}

/**
 * newAddress - Generate a new address.
 *
 * @param {('p2wkh'|'np2wkh')} addressType Address type
 * @returns {Function} Thunk
 */
export const newAddress = addressType => async dispatch => {
  dispatch({ type: NEW_ADDRESS, addressType })
  try {
    const data = await grpc.services.Lightning.newAddress({ type: ADDRESS_TYPES[addressType] })
    await dispatch(newAddressSuccess(addressType, data.address))
  } catch (error) {
    dispatch(newAddressFailure(addressType, error.message))
  }
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
      await node.setCurrentAddress(addressType, address)
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
  // TODO: i18n compatibility.
  dispatch(showError(`Unable to get ${addressType} address: ${error}`))
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
  [FETCH_ADDRESSES_SUCCESS]: (state, { addresses }) => {
    state.addresses = addresses
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
  [OPEN_WALLET_MODAL]: state => {
    state.walletModal = true
  },
  [CLOSE_WALLET_MODAL]: state => {
    state.walletModal = false
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
