import { createSelector } from 'reselect'
import { ipcRenderer } from 'electron'
import { callApi } from '../api'
import { btc, usd } from '../utils'
// ------------------------------------
// Constants
// ------------------------------------
export const SEARCH_INVOICES = 'SEARCH_INVOICES'

export const SET_INVOICE = 'SET_INVOICE'

export const GET_INVOICE = 'GET_INVOICE'
export const RECEIVE_INVOICE = 'RECEIVE_INVOICE'
export const RECEIVE_FORM_INVOICE = 'RECEIVE_FORM_INVOICE'

export const GET_INVOICES = 'GET_INVOICES'
export const RECEIVE_INVOICES = 'RECEIVE_INVOICES'

export const SEND_INVOICE = 'SEND_INVOICE'
export const INVOICE_SUCCESSFUL = 'INVOICE_SUCCESSFUL'

export const INVOICE_FAILED = 'INVOICE_FAILED'

// ------------------------------------
// Actions
// ------------------------------------
export function searchInvoices(invoicesSearchText) {
  return {
    type: SEARCH_INVOICES,
    invoicesSearchText
  }
}

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

export function receiveInvoice(invoice) {
  return {
    type: RECEIVE_INVOICE,
    invoice
  }
}

export function receiveFormInvoice(formInvoice) {
  return {
    type: RECEIVE_FORM_INVOICE,
    formInvoice
  }
}

export function getInvoices() {
  return {
    type: GET_INVOICES
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

export function invoiceFailed() {
  return {
    type: INVOICE_FAILED
  }
}

export const fetchInvoice = payreq => async (dispatch) => {
  dispatch(getInvoice())
  const invoice = await callApi(`invoice/${payreq}`, 'get')

  if (invoice) {
    dispatch(receiveFormInvoice(invoice.data))
    return true
  }
  dispatch(invoiceFailed())
  return false
}

// Send IPC event for invoices
export const fetchInvoices = () => async (dispatch) => {
  dispatch(getInvoices())
  ipcRenderer.send('lnd', { msg: 'invoices' })
}

// Receive IPC event for invoices
export const receiveInvoices = (event, { invoices }) => dispatch => dispatch({ type: RECEIVE_INVOICES, invoices })

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
// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SEARCH_INVOICES]: (state, { invoicesSearchText }) => ({ ...state, invoicesSearchText }),

  [SET_INVOICE]: (state, { invoice }) => ({ ...state, invoice }),

  [GET_INVOICE]: state => ({ ...state, invoiceLoading: true }),
  [RECEIVE_INVOICE]: (state, { invoice }) => ({ ...state, invoiceLoading: false, invoice }),
  [RECEIVE_FORM_INVOICE]: (state, { formInvoice }) => (
    { ...state, invoiceLoading: false, formInvoice }
  ),

  [GET_INVOICES]: state => ({ ...state, invoiceLoading: true }),
  [RECEIVE_INVOICES]: (state, { invoices }) => ({ ...state, invoiceLoading: false, invoices }),

  [SEND_INVOICE]: state => ({ ...state, invoiceLoading: true }),
  [INVOICE_SUCCESSFUL]: (state, { invoice }) => (
    { ...state, invoiceLoading: false, invoices: [invoice, ...state.invoices] }
  ),
  [INVOICE_FAILED]: state => ({ ...state, invoiceLoading: false, data: null })
}

const invoiceSelectors = {}
const invoiceSelector = state => state.invoice.invoice
const invoicesSelector = state => state.invoice.invoices
const invoicesSearchTextSelector = state => state.invoice.invoicesSearchText

invoiceSelectors.invoiceModalOpen = createSelector(
  invoiceSelector,
  invoice => (!!invoice)
)

invoiceSelectors.invoices = createSelector(
  invoicesSelector,
  invoicesSearchTextSelector,
  (invoices, invoicesSearchText) => invoices.filter(invoice => invoice.memo.includes(invoicesSearchText))
)

export { invoiceSelectors }

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  invoiceLoading: false,
  invoices: [],
  invoice: null,
  invoicesSearchText: '',
  data: {},
  formInvoice: {
    payreq: '',
    r_hash: '',
    amount: '0'
  }
}

export default function invoiceReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
