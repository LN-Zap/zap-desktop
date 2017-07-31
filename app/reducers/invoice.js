import { callApi } from '../api'
import { btc, usd } from '../utils'
// ------------------------------------
// Constants
// ------------------------------------
export const GET_INVOICE = 'GET_INVOICE'
export const RECEIVE_INVOICE = 'RECEIVE_INVOICE'
export const SEND_INVOICE = 'SEND_INVOICE'
export const INVOICE_SUCCESSFUL = 'INVOICE_SUCCESSFUL'
export const INVOICE_FAILED = 'INVOICE_FAILED'

// ------------------------------------
// Actions
// ------------------------------------
export function getInvoice() {
  return {
    type: GET_INVOICE
  }
}

export function receiveInvoice(data) {
  return {
    type: RECEIVE_INVOICE,
    data
  }
}

export function sendInvoice() {
  return {
    type: SEND_INVOICE
  }
}

export function invoiceSuccessful(data) {
  return {
    type: INVOICE_SUCCESSFUL,
    data
  }
}

export function invoiceFailed() {
  return {
    type: SEND_PAYMENT
  }
}

export const fetchInvoice = (r_hash) => async (dispatch) => {
  dispatch(getInvoice())
  const invoice = await callApi(`invoice/${r_hash}`, 'get')

  invoice ?
    dispatch(receiveInvoice(invoice.data))
  :
    dispatch(invoiceFailed())

  return invoice
}

export const createInvoice = (amount, memo, currency, rate) => async (dispatch) => {
  const value = currency === 'btc' ? btc.btcToSatoshis(amount) : btc.btcToSatoshis(usd.usdToBtc(amount, rate))

  dispatch(sendInvoice())
  const invoice = await callApi('addinvoice', 'post', { value, memo })
  console.log('invoice: ', invoice.data)
  if (invoice) {
    dispatch(invoiceSuccessful(invoice.data))
  } else {
    dispatch(invoiceFailed())
  }

  return invoice
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [GET_INVOICE]: (state) => ({ ...state, loading: true }),
  [RECEIVE_INVOICE]: (state, { data }) => ({ ...state, loading: false, data }),
  [SEND_INVOICE]: (state) => ({ ...state, loading: true }),
  [INVOICE_SUCCESSFUL]: (state, { data }) => ({ ...state, loading: false, data }),
  [INVOICE_FAILED]: (state) => ({ ...state, loading: false, data: null })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  loading: false,
  data: {}
}

export default function invoiceReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}