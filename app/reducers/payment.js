import { callApi } from '../api'
import { btc } from '../utils'
// ------------------------------------
// Constants
// ------------------------------------
export const SEND_PAYMENT = 'SEND_PAYMENT'
export const PAYMENT_SUCCESSFULL = 'PAYMENT_SUCCESSFULL'
export const PAYMENT_FAILED = 'PAYMENT_FAILED'

// ------------------------------------
// Actions
// ------------------------------------
export function sendPayment() {
  return {
    type: SEND_PAYMENT
  }
}

export function paymentSuccessfull(data) {
  return {
    type: PAYMENT_SUCCESSFULL,
    data
  }
}

export function paymentFailed() {
  return {
    type: PAYMENT_FAILED
  }
}

export const makePayment = (dest_string, btc_amount) => async (dispatch) => {
  const amt = btc.btcToSatoshis(btc_amount)

  dispatch(sendPayment())
  const payment = await callApi('payments', 'post', { dest_string, amt })
  payment ?
    dispatch(paymentSuccessfull(payment))
  :
    dispatch(paymentFailed())

  return payment
}


// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  paymentLoading: false
}

export default function paymentReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}