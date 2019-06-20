import { createSelector } from 'reselect'
import { showSystemNotification } from '@zap/utils/notifications'
import { convert } from '@zap/utils/btc'
import { grpcService } from 'workers'
import { fetchBalance } from './balance'
import { fetchChannels } from './channels'
import { showError } from './notification'
import { walletSelectors } from './wallet'
import { settingsSelectors } from './settings'

// ------------------------------------
// Constants
// ------------------------------------
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

/**
 * decorateInvoice - Decorate invoice object with custom/computed properties.
 *
 * @param  {object} invoice Invoice
 * @returns {object} Decorated invoice
 */
const decorateInvoice = invoice => {
  const decoration = {
    type: 'invoice',
    finalAmount: invoice.amt_paid_sat ? invoice.amt_paid_sat : invoice.value,
  }
  return {
    ...invoice,
    ...decoration,
  }
}

// ------------------------------------
// Actions
// ------------------------------------

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

// Send IPC event for invoices
export const fetchInvoices = () => async dispatch => {
  dispatch(getInvoices())
  const grpc = await grpcService
  const invoices = await grpc.services.Lightning.listInvoices({ num_max_invoices: 2500 })
  dispatch(receiveInvoices(invoices))
}

// Receive IPC event for invoices
export const receiveInvoices = ({ invoices }) => dispatch => {
  const decoratedInvoicves = invoices.map(decorateInvoice)
  dispatch({ type: RECEIVE_INVOICES, invoices: decoratedInvoicves })
}

// Send IPC event for creating an invoice
export const createInvoice = (amount, cryptoUnit, memo, isPrivate) => async (
  dispatch,
  getState
) => {
  const state = getState()

  // backend needs value in satoshis no matter what currency we are using
  const value = convert(cryptoUnit, 'sats', amount)

  dispatch(sendInvoice())

  // Grab the activeWallet type from our local store. If the active connection type is local (light clients using
  // neutrino) we will have to flag private as true when creating this invoice. All light cliets open private channels
  // (both manual and autopilot ones). In order for these clients to receive money through these channels the invoices
  // need to come with routing hints for private channels.
  const activeWalletSettings = walletSelectors.activeWalletSettings(state)
  const currentConfig = settingsSelectors.currentConfig(state)

  try {
    const grpc = await grpcService
    const invoice = await grpc.services.Lightning.createInvoice({
      value,
      memo,
      private: isPrivate || activeWalletSettings.type === 'local',
      expiry: currentConfig.invoices.expire,
    })
    dispatch(createdInvoice(invoice))
  } catch (e) {
    dispatch(invoiceFailed(e))
  }
}

// Receive IPC event for newly created invoice
export const createdInvoice = invoice => dispatch => {
  const decoratedInvoice = decorateInvoice(invoice)

  // Add new invoice to invoices list
  dispatch({ type: INVOICE_SUCCESSFUL, invoice: decoratedInvoice })

  // Set current invoice to newly created invoice.
  dispatch(setInvoice(decoratedInvoice.payment_request))
}

export const invoiceFailed = ({ error }) => dispatch => {
  dispatch({ type: INVOICE_FAILED })
  dispatch(showError(error))
}

// Listen for invoice updates pushed from backend from subscribeToInvoices
export const receiveInvoiceData = invoice => dispatch => {
  const decoratedInvoice = decorateInvoice(invoice)

  dispatch({ type: UPDATE_INVOICE, invoice: decoratedInvoice })

  // Fetch new balance
  dispatch(fetchBalance())

  // Fetch updated channels.
  dispatch(fetchChannels())

  if (decoratedInvoice.settled) {
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

invoiceSelectors.invoice = invoiceSelector

invoiceSelectors.invoices = createSelector(
  invoicesSelector,
  invoices => invoices
)

invoiceSelectors.invoiceModalOpen = createSelector(
  invoiceSelector,
  invoice => Boolean(invoice)
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
