import { createSelector } from 'reselect'
import { ipcRenderer } from 'electron'
import { callApi } from '../api'

// ------------------------------------
// Constants
// ------------------------------------
export const SET_PAYMENT = 'SET_PAYMENT'

export const GET_PAYMENTS = 'GET_PAYMENTS'
export const RECEIVE_PAYMENTS = 'RECEIVE_PAYMENTS'

export const SEND_PAYMENT = 'SEND_PAYMENT'
export const PAYMENT_SUCCESSFULL = 'PAYMENT_SUCCESSFULL'
export const PAYMENT_FAILED = 'PAYMENT_FAILED'

// ------------------------------------
// Actions
// ------------------------------------
export function setPayment(payment) {
  return {
    type: SET_PAYMENT,
    payment
  }
}

export function getPayments() {
  return {
    type: GET_PAYMENTS
  }
}

export function sendPayment() {
  return {
    type: SEND_PAYMENT
  }
}

export function paymentSuccessfull(payment) {
  return {
    type: PAYMENT_SUCCESSFULL,
    payment
  }
}

export function paymentFailed() {
  return {
    type: PAYMENT_FAILED
  }
}

// Send IPC event for payments
export const fetchPayments = () => async (dispatch) => {
  dispatch(getPayments())
  ipcRenderer.send('lnd', { msg: 'payments' })
}

// Receive IPC event for payments
export const receivePayments = (event, { payments }) => dispatch => dispatch({ type: RECEIVE_PAYMENTS, payments })

export const payInvoice = payment_request => async (dispatch) => {
  dispatch(sendPayment())
  const payment = await callApi('sendpayment', 'post', { payment_request })

  if (payment) {
    dispatch(fetchPayments())
  } else {
    dispatch(paymentFailed())
  }

  return payment
}


// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SET_PAYMENT]: (state, { payment }) => ({ ...state, payment }),
  [GET_PAYMENTS]: state => ({ ...state, paymentLoading: true }),
  [RECEIVE_PAYMENTS]: (state, { payments }) => ({ ...state, paymentLoading: false, payments }),
  [PAYMENT_SUCCESSFULL]: (state, { payment }) => (
    { ...state, paymentLoading: false, payments: [payment, ...state.payments] }
  )
}

const paymentSelectors = {}
const modalPaymentSelector = state => state.payment.payment

paymentSelectors.paymentModalOpen = createSelector(
  modalPaymentSelector,
  payment => (!!payment)
)

export { paymentSelectors }

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  paymentLoading: false,
  payments: [],
  payment: null
}

export default function paymentReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
