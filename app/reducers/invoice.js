import { createSelector } from 'reselect'
import { callApi } from '../api'
import { btc, usd } from '../utils'
// ------------------------------------
// Constants
// ------------------------------------
export const SET_INVOICE = 'SET_INVOICE'

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
export function setInvoice(invoice) {
  return {
    type: SET_INVOICE,
    invoice
  }
}

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

export function invoiceSuccessful(invoice) {
  return {
    type: INVOICE_SUCCESSFUL,
    invoice
  }
}

export const fetchInvoice = (r_hash) => async (dispatch) => {
  dispatch(getInvoice())
  const invoice = await callApi(`invoice/${r_hash}`, 'get')

  if (invoice) {
    dispatch(receiveInvoice(invoice.data))
    return true
  } else {
    dispatch(invoicesFailed())
    return false
  }
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
  if (invoice) {
    dispatch(invoiceSuccessful({ memo, value, payment_request: invoice.data.payment_request }))
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
  [SET_INVOICE]: (state, { invoice }) => ({ ...state, invoice }),

  [GET_INVOICE]: (state) => ({ ...state, invoiceLoading: true }),
  [RECEIVE_INVOICE]: (state, { data }) => ({ ...state, invoiceLoading: false, data }),

  [GET_INVOICES]: (state) => ({ ...state, invoiceLoading: true }),
  [RECEIVE_INVOICES]: (state, { invoices }) => ({ ...state, invoiceLoading: false, invoices }),

  [SEND_INVOICE]: (state) => ({ ...state, invoiceLoading: true }),
  [INVOICE_SUCCESSFUL]: (state, { invoice }) => ({ ...state, invoiceLoading: false, invoices: [invoice, ...state.invoices] }),
  [INVOICE_FAILED]: (state) => ({ ...state, invoiceLoading: false, data: null })
}

const invoiceSelectors = {}
const modalInvoiceSelector = state => state.invoice.invoice

invoiceSelectors.invoiceModalOpen = createSelector(
  modalInvoiceSelector,
  invoice => invoice ? true : false
)

export { invoiceSelectors }

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  invoiceLoading: false,
  invoices: [],
  invoice: null,
  data: {}
}

export default function invoiceReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}