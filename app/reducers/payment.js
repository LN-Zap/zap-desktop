import { createSelector } from 'reselect'
import { ipcRenderer } from 'electron'
import { fetchBalance } from './balance'
import { setFormType } from './form'
import { resetPayForm } from './payform'
import { setError } from './error'

// ------------------------------------
// Constants
// ------------------------------------
export const SET_PAYMENT = 'SET_PAYMENT'

export const GET_PAYMENTS = 'GET_PAYMENTS'
export const RECEIVE_PAYMENTS = 'RECEIVE_PAYMENTS'

export const SEND_PAYMENT = 'SEND_PAYMENT'

export const PAYMENT_SUCCESSFULL = 'PAYMENT_SUCCESSFULL'
export const PAYMENT_FAILED = 'PAYMENT_FAILED'

export const SHOW_SUCCESS_SCREEN = 'SHOW_SUCCESS_SCREEN'
export const HIDE_SUCCESS_SCREEN = 'HIDE_SUCCESS_SCREEN'

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

export function showSuccessScreen() {
  return {
    type: SHOW_SUCCESS_SCREEN
  }
}

export function hideSuccessScreen() {
  return {
    type: HIDE_SUCCESS_SCREEN
  }
}

// Send IPC event for payments
export const fetchPayments = () => dispatch => {
  dispatch(getPayments())
  ipcRenderer.send('lnd', { msg: 'payments' })
}

// Receive IPC event for payments
export const receivePayments = (event, { payments }) => dispatch =>
  dispatch({ type: RECEIVE_PAYMENTS, payments })

// Receive IPC event for successful payment
// TODO: Add payment to state, not a total re-fetch
export const paymentSuccessful = () => dispatch => {
  // Dispatch successful payment to stop loading screen
  dispatch(paymentSuccessfull())

  // Show successful payment state for 5 seconds
  dispatch(showSuccessScreen())
  setTimeout(() => dispatch(hideSuccessScreen()), 5000)
  // Refetch payments (TODO: dont do a full refetch, rather append new tx to list)
  dispatch(fetchPayments())

  // Reset the payment form
  dispatch(resetPayForm())

  // Fetch new balance
  dispatch(fetchBalance())
}

export const paymentFailed = (event, { error }) => dispatch => {
  dispatch({ type: PAYMENT_FAILED })
  dispatch(setError(error))
}

export const payInvoice = paymentRequest => dispatch => {
  dispatch(sendPayment())
  ipcRenderer.send('lnd', { msg: 'sendPayment', data: { paymentRequest } })

  // Close the form modal once the payment has been sent
  dispatch(setFormType(null))

  // if LND hangs on sending the payment we'll cut it after 10 seconds and return an error
  // setTimeout(() => {
  //   const { payment } = getState()

  //   if (payment.sendingPayment) {
  //     dispatch(paymentFailed(null, { error: 'Shoot, we\'re having some trouble sending your payment.' }))
  //   }
  // }, 10000)
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [GET_PAYMENTS]: state => ({ ...state, paymentLoading: true }),
  [RECEIVE_PAYMENTS]: (state, { payments }) => ({ ...state, paymentLoading: false, payments }),

  [SET_PAYMENT]: (state, { payment }) => ({ ...state, payment }),
  [SEND_PAYMENT]: state => ({ ...state, sendingPayment: true }),
  [PAYMENT_SUCCESSFULL]: state => ({ ...state, sendingPayment: false }),
  [PAYMENT_FAILED]: state => ({ ...state, sendingPayment: false }),

  [SHOW_SUCCESS_SCREEN]: state => ({ ...state, showSuccessPayScreen: true }),
  [HIDE_SUCCESS_SCREEN]: state => ({ ...state, showSuccessPayScreen: false })
}

const paymentSelectors = {}
const modalPaymentSelector = state => state.payment.payment

paymentSelectors.paymentModalOpen = createSelector(modalPaymentSelector, payment => !!payment)

export { paymentSelectors }

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  sendingPayment: false,
  paymentLoading: false,
  payments: [],
  payment: null,
  showSuccessPayScreen: false
}

export default function paymentReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
