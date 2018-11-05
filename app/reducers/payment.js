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

export const TICK_TIMEOUT = 'TICK_TIMEOUT'
export const SET_INTERVAL = 'SET_INTERVAL'
export const RESET_TIMEOUT = 'RESET_TIMEOUT'

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

export function tickTimeout() {
  return {
    type: TICK_TIMEOUT
  }
}

export function setPaymentInterval(paymentInterval) {
  return {
    type: SET_INTERVAL,
    paymentInterval
  }
}

export function resetTimeout() {
  return {
    type: RESET_TIMEOUT
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

export const payInvoice = (paymentRequest, feeLimit) => (dispatch, getState) => {
  dispatch(sendPayment())
  ipcRenderer.send('lnd', { msg: 'sendPayment', data: { paymentRequest, feeLimit } })

  // Set an interval to call tick which will continuously tick down the ticker until the payment goes through or it hits
  // 0 and throws an error. We also call setPaymentInterval so we are storing the interval. This allows us to clear the
  // interval in flexible ways whenever we need to
  const paymentInterval = setInterval(() => tick(dispatch, getState), 1000)
  dispatch(setPaymentInterval(paymentInterval))

  // Close the form modal once the payment has been sent
  dispatch(setFormType(null))
}

// Tick checks if the payment is sending and checks the timeout every second. If the payment is still sending and the
// timeout is above 0 it will continue to tick it down, once we hit 0 we fire an error to the user and reset the reducer
const tick = (dispatch, getState) => {
  const { payment } = getState()

  if (payment.sendingPayment && payment.paymentTimeout <= 0) {
    dispatch(paymentFailed(null, { error: 'Shoot, there was some trouble sending your payment.' }))
  } else {
    dispatch(tickTimeout())
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [GET_PAYMENTS]: state => ({ ...state, paymentLoading: true }),
  [RECEIVE_PAYMENTS]: (state, { payments }) => ({ ...state, paymentLoading: false, payments }),

  [SET_PAYMENT]: (state, { payment }) => ({ ...state, payment }),

  [SEND_PAYMENT]: state => ({ ...state, sendingPayment: true }),

  [TICK_TIMEOUT]: state => ({ ...state, paymentTimeout: state.paymentTimeout - 1000 }),
  [SET_INTERVAL]: (state, { paymentInterval }) => ({ ...state, paymentInterval }),

  [PAYMENT_SUCCESSFULL]: state => {
    clearInterval(state.paymentInterval)

    return {
      ...state,
      sendingPayment: false,
      paymentInterval: null,
      paymentTimeout: 60000
    }
  },
  [PAYMENT_FAILED]: state => {
    clearInterval(state.paymentInterval)

    return {
      ...state,
      sendingPayment: false,
      paymentInterval: null,
      paymentTimeout: 60000
    }
  },

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
  paymentTimeout: 60000,
  paymentInterval: null,
  payments: [],
  payment: null,
  showSuccessPayScreen: false
}

export default function paymentReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
