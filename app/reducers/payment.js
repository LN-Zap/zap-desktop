import { callApi } from '../api'
import { btc } from '../utils'
// ------------------------------------
// Constants
// ------------------------------------
export const GET_PAYMENTS = 'GET_PAYMENTS'
export const RECEIVE_PAYMENTS = 'RECEIVE_PAYMENTS'

export const SEND_PAYMENT = 'SEND_PAYMENT'
export const PAYMENT_SUCCESSFULL = 'PAYMENT_SUCCESSFULL'
export const PAYMENT_FAILED = 'PAYMENT_FAILED'

// ------------------------------------
// Actions
// ------------------------------------
export function getPayments() {
  return {
    type: GET_PAYMENTS
  }
}

export function receivePayments(data) {
  return {
    type: RECEIVE_PAYMENTS,
    payments: data.payments.reverse()
  }
}

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

export const fetchPayments = () => async (dispatch) => {
  dispatch(getPayments())
  const payments = await callApi('payments')
  payments ?
    dispatch(receivePayments(payments.data))
  :
    dispatch(paymentFailed())

  return payments
}

export const payInvoice = (payment_request) => async (dispatch) => {
  console.log('payment_request: ', payment_request)
  dispatch(sendPayment())
  const payment = await callApi('sendpayment', 'post', { payment_request })
  console.log('payment: ', payment)

  return 
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
  [GET_PAYMENTS]: (state) => ({ ...state, paymentLoading: true }),
  [RECEIVE_PAYMENTS]: (state, { payments }) => ({ ...state, paymentLoading: false, payments })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  paymentLoading: false,
  payments: []
}

export default function paymentReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}