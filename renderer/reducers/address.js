import { grpcService } from 'workers'
import { openModal, closeModal } from './modal'

// ------------------------------------
// Constants
// ------------------------------------
export const GET_ADDRESS = 'GET_ADDRESS'
export const GET_ADDRESS_SUCCESS = 'GET_ADDRESS_SUCCESS'
export const GET_ADDRESS_FAILURE = 'GET_ADDRESS_FAILURE'

export const OPEN_WALLET_MODAL = 'OPEN_WALLET_MODAL'
export const CLOSE_WALLET_MODAL = 'CLOSE_WALLET_MODAL'

// LND expects types to be sent as int, so this object will allow mapping from string to int
const addressTypes = {
  p2wkh: 0,
  np2wkh: 1,
  p2pkh: 2,
}

// ------------------------------------
// Actions
// ------------------------------------
export function getAddress() {
  return {
    type: GET_ADDRESS,
  }
}

export const openWalletModal = () => dispatch => dispatch(openModal('RECEIVE_MODAL'))
export const closeWalletModal = () => dispatch => dispatch(closeModal('RECEIVE_MODAL'))

// Get our existing address if there is one, otherwise generate a new one.
export const walletAddress = type => async (dispatch, getState) => {
  let address

  // Wallet addresses are keyed under the node pubKey in our store.
  const state = getState()
  const pubKey = state.info.data.identity_pubkey

  if (pubKey) {
    const node = await window.db.nodes.get({ id: pubKey })
    if (node) {
      address = node.getCurrentAddress(type)
    }
  }

  // If we have an address already, use that. Otherwise, generate a new address.
  if (address) {
    dispatch({ type: GET_ADDRESS_SUCCESS, address })
  } else {
    dispatch(newAddress(type))
  }
}

// Send IPC event for getinfo
export const newAddress = type => async dispatch => {
  try {
    dispatch(getAddress())
    const grpc = await grpcService
    const data = await grpc.services.Lightning.newAddress({ type: addressTypes[type] })
    dispatch(receiveAddressSuccess({ ...data, type }))
  } catch (error) {
    dispatch(newAddressFailure(error))
  }
}

// Receive IPC event for info
export const receiveAddressSuccess = ({ type, address }) => async (dispatch, getState) => {
  const state = getState()
  const pubKey = state.info.data.identity_pubkey

  // If we know the node's public key, store the address for reuse.
  if (pubKey) {
    const typeName = Object.keys(addressTypes).find(key => addressTypes[key] === type)
    const node = await window.db.nodes.get(pubKey)
    if (node) {
      await node.setCurrentAddress(typeName, address)
    } else {
      await window.db.nodes.put({ id: pubKey, addresses: { [typeName]: address } })
    }
  }

  dispatch({ type: GET_ADDRESS_SUCCESS, address: address })
}

export const newAddressFailure = error => ({
  type: GET_ADDRESS_FAILURE,
  newAddressError: error,
})

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [GET_ADDRESS]: state => ({ ...state, addressLoading: true }),
  [GET_ADDRESS_SUCCESS]: (state, { address }) => ({
    ...state,
    addressLoading: false,
    newAddressError: null,
    address,
  }),
  [GET_ADDRESS_FAILURE]: (state, { newAddressError }) => ({
    ...state,
    addressLoading: false,
    newAddressError,
  }),
  [OPEN_WALLET_MODAL]: state => ({ ...state, walletModal: true }),
  [CLOSE_WALLET_MODAL]: state => ({ ...state, walletModal: false }),
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  addressLoading: false,
  address: '',
  newAddressError: null,
  walletModal: false,
}

export default function addressReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
