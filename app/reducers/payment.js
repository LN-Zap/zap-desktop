import { createSelector } from 'reselect'
import { ipcRenderer } from 'electron'
import { setForm, resetForm } from './form'

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
export const fetchPayments = () => (dispatch) => {
  dispatch(getPayments())
  ipcRenderer.send('lnd', { msg: 'payments' })
}

// Receive IPC event for payments
export const receivePayments = (event, { payments }) => dispatch => dispatch({ type: RECEIVE_PAYMENTS, payments })

export const payInvoice = paymentRequest => (dispatch) => {
  dispatch(sendPayment())
  ipcRenderer.send('lnd', { msg: 'sendPayment', data: { paymentRequest } })
}

// Receive IPC event for successful payment
// TODO: Add payment to state, not a total re-fetch
export const paymentSuccessful = () => (dispatch) => {
  // Close the form modal once the payment was succesful
  dispatch(setForm({ modalOpen: false }))

  // Refetch payments (TODO: dont do a full refetch, rather append new tx to list)
  dispatch(fetchPayments())

  // Reset the payment form
  dispatch(resetForm())
}


// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SET_PAYMENT]: (state, { payment }) => ({ ...state, payment }),
  [GET_PAYMENTS]: state => ({ ...state, paymentLoading: true }),
  [SEND_PAYMENT]: state => ({ ...state, sendingPayment: true }),
  [RECEIVE_PAYMENTS]: (state, { payments }) => ({ ...state, paymentLoading: false, payments }),
  [PAYMENT_SUCCESSFULL]: state => ({ ...state, sendingPayment: false }),
  [PAYMENT_FAILED]: state => ({ ...state, sendingPayment: false })
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
  sendingPayment: false,
  paymentLoading: false,
  payments: [],
  payment: null
}

export default function paymentReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
