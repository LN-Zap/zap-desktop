import { createSelector } from 'reselect'
import { ipcRenderer } from 'electron'
import { btc, usd } from '../utils'
import { setForm } from './form'

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

export const sendCoins = ({ value, addr, currency, crypto, rate }) => dispatch => {
  const amount = currency === 'usd' ? btc.btcToSatoshis(usd.usdToBtc(value, rate)) : btc.btcToSatoshis(value)
  dispatch(sendPayment)
  ipcRenderer.send('lnd', { msg: 'sendCoins', data: { amount, addr } })
}

// Receive IPC event for successful payment
// TODO: Add payment to state, not a total re-fetch
export const paymentSuccessful = () => fetchPayments()

export const sendSuccessful = (event, { amount, addr, txid }) => dispatch => {
  console.log('amount: ', amount)
  console.log('addr: ', addr)
  console.log('txid: ', txid)
  dispatch(setForm({ modalOpen: false }))
  // TODO: Add successful on-chain payment to payments list once payments list supports on-chain and LN
  // dispatch({ type: PAYMENT_SUCCESSFULL, payment: { amount, addr, txid, pending: true } })
}


// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SET_PAYMENT]: (state, { payment }) => ({ ...state, payment }),
  [GET_PAYMENTS]: state => ({ ...state, paymentLoading: true }),
  [SEND_PAYMENT]: state => ({ ...state, sendingPayment: true }),
  [RECEIVE_PAYMENTS]: (state, { payments }) => ({ ...state, paymentLoading: false, payments }),
  [PAYMENT_SUCCESSFULL]: (state, { payment }) => (
    { ...state, sendingPayment: false, payments: [payment, ...state.payments] }
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
  sendingPayment: false,
  paymentLoading: false,
  payments: [],
  payment: null
}

export default function paymentReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
