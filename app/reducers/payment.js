import { callApi } from '../api'
import { btcToSatoshis, btcToUsd } from '../utils/bitcoin'
// ------------------------------------
// Constants
// ------------------------------------
export const SET_AMOUNT = 'SET_AMOUNT'
export const SET_MESSAGE = 'SET_MESSAGE'
export const SET_PUBKEY = 'SET_PUBKEY'

// ------------------------------------
// Actions
// ------------------------------------
export function setAmount(amount) {
  return {
    type: SET_AMOUNT,
    amount
  }
}

export function setMessage(message) {
  return {
    type: SET_MESSAGE,
    message
  }
}

export function setPubkey(pubkey) {
  return {
    type: SET_PUBKEY,
    pubkey
  }
}


// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SET_AMOUNT]: (state, { amount }) => ({ ...state, amount }),
  [SET_MESSAGE]: (state, { message }) => ({ ...state, message }),
  [SET_PUBKEY]: (state, { pubkey }) => ({ ...state, pubkey })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  paymentLoading: false,
  amount: '0',
  message: '',
  pubkey: ''
}

export default function paymentReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}