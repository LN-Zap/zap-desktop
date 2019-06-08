import get from 'lodash/get'
import { createSelector } from 'reselect'
import { grpcService } from 'workers'
import { openModal, closeModal } from './modal'
import { settingsSelectors } from './settings'

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
 * Initialise addresses.
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
 * Generate a new address.
 */
export const newAddress = type => async dispatch => {
  dispatch({ type: NEW_ADDRESS })
  try {
    const grpc = await grpcService
    const data = await grpc.services.Lightning.newAddress({ type: ADDRESS_TYPES[type] })
    await dispatch(newAddressSuccess({ ...data, type }))
  } catch (error) {
    dispatch(newAddressFailure(error))
  }
}

/**
 * Generate a new address success callback
 */
export const newAddressSuccess = ({ type, address }) => async (dispatch, getState) => {
  const state = getState()
  const pubKey = state.info.data.identity_pubkey

  // If we know the node's public key, store the address for reuse.
  if (pubKey) {
    const node = await window.db.nodes.get(pubKey)
    if (node) {
      await node.setCurrentAddress(type, address)
    } else {
      await window.db.nodes.put({ id: pubKey, addresses: { [type]: address } })
    }
  }

  dispatch({ type: NEW_ADDRESS_SUCCESS, payload: { address, type } })
}

/**
 * Generate a new address failure callback
 */
export const newAddressFailure = error => ({
  type: NEW_ADDRESS_FAILURE,
  newAddressError: error,
})

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [FETCH_ADDRESSES_SUCCESS]: (state, { addresses }) => ({
    ...state,
    addresses,
  }),
  [NEW_ADDRESS]: state => ({ ...state, addressLoading: true }),
  [NEW_ADDRESS_SUCCESS]: (state, { payload: { address, type } }) => ({
    ...state,
    addressLoading: false,
    newAddressError: null,
    addresses: { ...state.addresses, [type]: address },
  }),
  [NEW_ADDRESS_FAILURE]: (state, { newAddressError }) => ({
    ...state,
    addressLoading: false,
    newAddressError,
  }),
  [OPEN_WALLET_MODAL]: state => ({ ...state, walletModal: true }),
  [CLOSE_WALLET_MODAL]: state => ({ ...state, walletModal: false }),
}

// ------------------------------------
// Selectors
// ------------------------------------

const addressSelectors = {}
addressSelectors.currentAddresses = state => state.address.addresses
addressSelectors.currentConfig = state => settingsSelectors.currentConfig(state)
addressSelectors.currentAddress = createSelector(
  addressSelectors.currentAddresses,
  addressSelectors.currentConfig,
  (currentAddresses, currentConfig) => currentAddresses[currentConfig.address]
)
export { addressSelectors }

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  addressLoading: false,
  addresses: {
    np2wkh: null,
    p2wkh: null,
  },
  newAddressError: null,
  walletModal: false,
}

export default function addressReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
