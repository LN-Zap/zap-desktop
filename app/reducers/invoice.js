import { callApi } from '../api'
import { btc, usd } from '../utils'
// ------------------------------------
// Constants
// ------------------------------------
export const GET_INVOICE = 'GET_INVOICE'
export const RECEIVE_INVOICE = 'RECEIVE_INVOICE'

export const GET_INVOICES = 'GET_INVOICES'
export const RECEIVE_INVOICES = 'RECEIVE_INVOICES'

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

export function getInvoices() {
  return {
    type: GET_INVOICES
  }
}

export function receiveInvoices(data) {
  return {
    type: RECEIVE_INVOICES,
    invoices: data.invoices.reverse()
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

export const fetchInvoice = (r_hash) => async (dispatch) => {
  dispatch(getInvoice())
  const invoice = await callApi(`invoice/${r_hash}`, 'get')

  invoice ?
    dispatch(receiveInvoice(invoice.data))
  :
    dispatch(invoicesFailed())

  return invoice
}

export const fetchInvoices = () => async (dispatch) => {
  dispatch(getInvoice())
  const invoices = await callApi('invoices')
  invoices ?
    dispatch(receiveInvoices(invoices.data))
  :
    dispatch(invoiceFailed())

  return invoices
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


export function invoiceFailed() {
  return {
    type: INVOICE_FAILED
  }
}
// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [GET_INVOICE]: (state) => ({ ...state, invoiceLoading: true }),
  [RECEIVE_INVOICE]: (state, { data }) => ({ ...state, invoiceLoading: false, data }),

  [GET_INVOICES]: (state) => ({ ...state, invoiceLoading: true }),
  [RECEIVE_INVOICES]: (state, { invoices }) => ({ ...state, invoiceLoading: false, invoices }),

  [SEND_INVOICE]: (state) => ({ ...state, invoiceLoading: true }),
  [INVOICE_SUCCESSFUL]: (state, { data }) => ({ ...state, invoiceLoading: false, data }),
  [INVOICE_FAILED]: (state) => ({ ...state, invoiceLoading: false, data: null })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  invoiceLoading: false,
  invoices: [],
  invoice: {},
  data: {}
}

export default function invoiceReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}