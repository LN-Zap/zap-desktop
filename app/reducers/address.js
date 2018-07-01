import { ipcRenderer } from 'electron'
import Store from 'electron-store'

// ------------------------------------
// Constants
// ------------------------------------
export const GET_ADDRESS = 'GET_ADDRESS'
export const RECEIVE_ADDRESS = 'RECEIVE_ADDRESS'

export const OPEN_WALLET_MODAL = 'OPEN_WALLET_MODAL'
export const CLOSE_WALLET_MODAL = 'CLOSE_WALLET_MODAL'

// LND expects types to be sent as int, so this object will allow mapping from string to int
const addressTypes = {
  p2wkh: 0,
  np2wkh: 1,
  p2pkh: 2
}

// ------------------------------------
// Actions
// ------------------------------------
export function getAddress() {
  return {
    type: GET_ADDRESS
  }
}

export function openWalletModal() {
  return {
    type: OPEN_WALLET_MODAL
  }
}

export function closeWalletModal() {
  return {
    type: CLOSE_WALLET_MODAL
  }
}

// Get our existing address if there is one, otherwise generate a new one.
export const walletAddress = type => (dispatch, getState) => {
  let address

  // Wallet addresses are keyed under the node pubKey in our store.
  const state = getState()
  const pubKey = state.info.data.identity_pubkey
  if (pubKey) {
    const store = new Store({ name: 'wallet' })
    address = store.get(`${pubKey}.${type}`, null)
  }

  // If we have an address already, use that. Otherwise, generate a new address.
  if (address) {
    dispatch({ type: RECEIVE_ADDRESS, address })
  } else {
    dispatch(newAddress(type))
  }
}

// Send IPC event for getinfo
export const newAddress = type => dispatch => {
  dispatch(getAddress())
  ipcRenderer.send('lnd', { msg: 'newaddress', data: { type: addressTypes[type] } })
}

// Receive IPC event for info
export const receiveAddress = (event, data) => (dispatch, getState) => {
  const state = getState()
  const pubKey = state.info.data.identity_pubkey

  // If we know the node's public key, store the address for reuse.
  if (pubKey) {
    const type = Object.keys(addressTypes).find(key => addressTypes[key] === data.type)
    const store = new Store({ name: 'wallet' })
    store.set(`${pubKey}.${type}`, data.address)
  }

  dispatch({ type: RECEIVE_ADDRESS, address: data.address })
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [GET_ADDRESS]: state => ({ ...state, addressLoading: true }),
  [RECEIVE_ADDRESS]: (state, { address }) => ({ ...state, addressLoading: false, address }),

  [OPEN_WALLET_MODAL]: state => ({ ...state, walletModal: true }),
  [CLOSE_WALLET_MODAL]: state => ({ ...state, walletModal: false })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  addressLoading: false,
  address: '',
  walletModal: false
}

export default function addressReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
