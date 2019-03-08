import { createSelector } from 'reselect'
import { send } from 'redux-electron-ipc'
import { showSystemNotification } from 'lib/utils/notifications'
import { btc } from 'lib/utils'
import { fetchBalance } from './balance'
import { showError } from './notification'
import { walletSelectors } from './wallet'

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

export const UPDATE_INVOICE = 'UPDATE_INVOICE'

// ------------------------------------
// Helpers
// ------------------------------------

// Decorate invoice object with custom/computed properties.
const decorateInvoice = invoice => {
  invoice.type = 'invoice'
  invoice.finalAmount = invoice.amt_paid_sat ? invoice.amt_paid_sat : invoice.value
  return invoice
}

// ------------------------------------
// Actions
// ------------------------------------
export function searchInvoices(invoicesSearchText) {
  return {
    type: SEARCH_INVOICES,
    invoicesSearchText,
  }
}

export function setInvoice(invoice) {
  return {
    type: SET_INVOICE,
    invoice,
  }
}

export function getInvoice() {
  return {
    type: GET_INVOICE,
  }
}

export function receiveInvoice(invoice) {
  return {
    type: RECEIVE_INVOICE,
    invoice,
  }
}

export function getInvoices() {
  return {
    type: GET_INVOICES,
  }
}

export function sendInvoice() {
  return {
    type: SEND_INVOICE,
  }
}

// Send IPC event for a specific invoice
export const fetchInvoice = payreq => dispatch => {
  dispatch(getInvoice())
  dispatch(send('lnd', { msg: 'invoice', data: { payreq } }))
}

// Send IPC event for invoices
export const fetchInvoices = () => dispatch => {
  dispatch(getInvoices())
  dispatch(send('lnd', { msg: 'invoices' }))
}

// Receive IPC event for invoices
export const receiveInvoices = (event, { invoices }) => dispatch => {
  invoices.forEach(decorateInvoice)
  dispatch({ type: RECEIVE_INVOICES, invoices })
}

// Send IPC event for creating an invoice
export const createInvoice = (amount, currency, memo) => async (dispatch, getState) => {
  const state = getState()

  // backend needs value in satoshis no matter what currency we are using
  const value = btc.convert(currency, 'sats', amount)

  dispatch(sendInvoice())

  // Grab the activeWallet type from our local store. If the active connection type is local (light clients using
  // neutrino) we will have to flag private as true when creating this invoice. All light cliets open private channels
  // (both manual and autopilot ones). In order for these clients to receive money through these channels the invoices
  // need to come with routing hints for private channels
  const activeWalletSettings = walletSelectors.activeWalletSettings(state)

  dispatch(
    send('lnd', {
      msg: 'createInvoice',
      data: { value, memo, private: activeWalletSettings.type === 'local' },
    })
  )
}

// Receive IPC event for newly created invoice
export const createdInvoice = (event, invoice) => dispatch => {
  decorateInvoice(invoice)

  // Add new invoice to invoices list
  dispatch({ type: INVOICE_SUCCESSFUL, invoice })

  // Set current invoice to newly created invoice.
  dispatch(setInvoice(invoice.payment_request))
}

export const invoiceFailed = (event, { error }) => dispatch => {
  dispatch({ type: INVOICE_FAILED })
  dispatch(showError(error))
}

// Listen for invoice updates pushed from backend from subscribeToInvoices
export const invoiceUpdate = (event, { invoice }) => dispatch => {
  decorateInvoice(invoice)

  dispatch({ type: UPDATE_INVOICE, invoice })

  // Fetch new balance
  dispatch(fetchBalance())

  if (invoice.settled) {
    // HTML 5 desktop notification for the invoice update
    const notifTitle = "You've been Zapped"
    const notifBody = 'Congrats, someone just paid an invoice of yours'

    showSystemNotification(notifTitle, notifBody)
  }
}
// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SEARCH_INVOICES]: (state, { invoicesSearchText }) => ({ ...state, invoicesSearchText }),

  [SET_INVOICE]: (state, { invoice }) => ({ ...state, invoice }),

  [GET_INVOICE]: state => ({ ...state, invoiceLoading: true }),
  [RECEIVE_INVOICE]: (state, { invoice }) => ({ ...state, invoiceLoading: false, invoice }),
  [RECEIVE_FORM_INVOICE]: state => ({ ...state, invoiceLoading: false }),

  [GET_INVOICES]: state => ({ ...state, invoiceLoading: true }),
  [RECEIVE_INVOICES]: (state, { invoices }) => ({ ...state, invoiceLoading: false, invoices }),

  [SEND_INVOICE]: state => ({ ...state, invoiceLoading: true }),
  [INVOICE_SUCCESSFUL]: state => ({
    ...state,
    invoiceLoading: false,
  }),
  [INVOICE_FAILED]: state => ({ ...state, invoiceLoading: false, data: null }),

  [UPDATE_INVOICE]: (state, action) => {
    let isNew = true
    const updatedInvoices = state.invoices.map(invoice => {
      if (invoice.r_hash.toString('hex') === action.invoice.r_hash.toString('hex')) {
        isNew = false
        return {
          ...invoice,
          ...action.invoice,
        }
      }
      return invoice
    })

    if (isNew) {
      updatedInvoices.push(action.invoice)
    }

    return { ...state, invoices: updatedInvoices }
  },
}

const invoiceSelectors = {}
const invoiceSelector = state => state.invoice.invoice
const invoicesSelector = state => state.invoice.invoices
const invoicesSearchTextSelector = state => state.invoice.invoicesSearchText

invoiceSelectors.invoiceModalOpen = createSelector(
  invoiceSelector,
  invoice => !!invoice
)

invoiceSelectors.invoices = createSelector(
  invoicesSelector,
  invoicesSearchTextSelector,
  (invoices, invoicesSearchText) =>
    invoices.filter(invoice => invoice.memo && invoice.memo.includes(invoicesSearchText))
)

invoiceSelectors.invoice = createSelector(
  invoicesSelector,
  invoiceSelector,
  (invoices, invoice) => invoices.find(item => item.payment_request === invoice)
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
    amount: '0',
  },
}

export default function invoiceReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
