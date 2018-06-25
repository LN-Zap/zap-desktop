import { ipcRenderer } from 'electron'
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

// Send IPC event for getinfo
export const newAddress = type => async dispatch => {
  dispatch(getAddress())
  ipcRenderer.send('lnd', { msg: 'newaddress', data: { type: addressTypes[type] } })
}

// Receive IPC event for info
export const receiveAddress = (event, address) => dispatch =>
  dispatch({ type: RECEIVE_ADDRESS, address })

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
