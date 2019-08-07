import { createSelector } from 'reselect'
import { showSystemNotification } from '@zap/utils/notifications'
import { convert } from '@zap/utils/btc'
import { grpc } from 'workers'
import { fetchBalance } from './balance'
import { fetchChannels } from './channels'
import { showError } from './notification'
import { walletSelectors } from './wallet'
import { settingsSelectors } from './settings'
import createReducer from './utils/createReducer'

// ------------------------------------
// Initial State
// ------------------------------------

const initialState = {
  invoiceLoading: false,
  createInvoiceError: null,
  invoices: [],
  invoice: null,
  data: {},
}

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
  // Add basic type information.
  const decoration = {
    type: 'invoice',
  }

  // Older versions of lnd provided the sat amount in `value`.
  // This is now deprecated in favor of `value_sat` and `value_msat`.
  // Patch data returned from older clients to match the current format for consistency.
  const { amt_paid } = invoice
  if (amt_paid && (!invoice.amt_paid_sat || !invoice.amt_paid_msat)) {
    Object.assign(decoration, {
      amt_paid_sat: amt_paid,
      amt_paid_msat: convert('sats', 'msats', amt_paid),
    })
  }

  // Add a `finalAmount` prop which shows the amount paid if set, or the invoice value if not.
  decoration.finalAmount = invoice.amt_paid_sat ? invoice.amt_paid_sat : invoice.value

  return {
    ...invoice,
    ...decoration,
  }
}

// ------------------------------------
// Actions
// ------------------------------------

/**
 * setInvoice - Set the active invoice.
 *
 * @param {object} invoice Invoice
 * @returns {object} Action
 */
export function setInvoice(invoice) {
  return {
    type: SET_INVOICE,
    invoice,
  }
}

/**
 * getInvoice - Fetch an invoice from lnd.
 *
 * @returns {object} Action
 */
export function getInvoice() {
  return {
    type: GET_INVOICE,
  }
}

/**
 * receiveInvoice - Receive an invoice from lnd.
 *
 * @param {object} invoice Invoice data.
 * @returns {object} Action
 */
export function receiveInvoice(invoice) {
  return {
    type: RECEIVE_INVOICE,
    invoice,
  }
}

/**
 * getInvoices - Fetch details of all invoices.
 *
 * @returns {object} Action
 */
export function getInvoices() {
  return {
    type: GET_INVOICES,
  }
}

/**
 * sendInvoice - Send an inveoice.
 *
 * @returns {object} Action
 */
export function sendInvoice() {
  return {
    type: SEND_INVOICE,
  }
}

/**
 * fetchInvoices - Fetch details of all invoices.
 *
 * @returns {object} Action
 */
export const fetchInvoices = () => async dispatch => {
  dispatch(getInvoices())
  const invoices = await grpc.services.Lightning.listInvoices({ num_max_invoices: 2500 })
  dispatch(receiveInvoices(invoices))
}

/**
 * receiveInvoices - Receive details of all invoice.
 *
 * @param {Array} data List of invoices
 * @returns {object} Action
 */
export const receiveInvoices = ({ invoices }) => dispatch => {
  dispatch({ type: RECEIVE_INVOICES, invoices })
}

/**
 * createInvoice - Create an invoice.
 *
 * @param {number} amount Amount
 * @param {string} cryptoUnit Crypto unit (sats, bits, btc)
 * @param {string} memo Memo
 * @param {boolean} isPrivate Set to true to include routing hints
 * @param {string} fallbackAddress on-chain address fallback
 * @returns {Function} Thunk
 */
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
    const invoice = await grpc.services.Lightning.createInvoice({
      value,
      memo,
      private: isPrivate || activeWalletSettings.type === 'local',
      expiry: currentConfig.invoices.expire,
    })
    dispatch(createInvoiceSuccess(invoice))
  } catch (error) {
    dispatch(createInvoiceFailure(error))
  }
}

/**
 * createInvoiceSuccess - Create invoice success handler.
 *
 * @param {object} invoice Invoice
 * @returns {Function} Thunk
 */
export const createInvoiceSuccess = invoice => dispatch => {
  // Add new invoice to invoices list
  dispatch({ type: INVOICE_SUCCESSFUL, invoice })

  // Set current invoice to newly created invoice.
  dispatch(setInvoice(invoice.payment_request))
}

/**
 * createInvoiceFailure - Create invoice error handler.
 *
 * @param {Error} error Error
 * @returns {Function} Thunk
 */
export const createInvoiceFailure = error => dispatch => {
  dispatch({ type: INVOICE_FAILED, createInvoiceError: error.message })
  dispatch(showError(error.message))
}

/**
 * receiveInvoiceData - Listen for invoice updates pushed from backend from invoices stream.
 *
 * @param {object} invoice Invoice
 * @returns {Function} Thunk
 */
export const receiveInvoiceData = invoice => dispatch => {
  dispatch({ type: UPDATE_INVOICE, invoice })

  // Fetch new balance
  dispatch(fetchBalance())

  // Fetch updated channels.
  dispatch(fetchChannels())

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
  [SET_INVOICE]: (state, { invoice }) => {
    state.invoice = invoice
  },

  [GET_INVOICE]: state => {
    state.invoiceLoading = true
  },
  [RECEIVE_INVOICE]: (state, { invoice }) => {
    state.invoiceLoading = false
    state.invoice = invoice
  },
  [RECEIVE_FORM_INVOICE]: state => {
    state.invoiceLoading = false
  },

  [GET_INVOICES]: state => {
    state.invoiceLoading = true
  },
  [RECEIVE_INVOICES]: (state, { invoices }) => {
    state.invoiceLoading = false
    state.invoices = invoices
  },

  [SEND_INVOICE]: state => {
    state.invoiceLoading = true
  },
  [INVOICE_SUCCESSFUL]: state => {
    state.invoiceLoading = false
  },
  [INVOICE_FAILED]: state => {
    state.invoiceLoading = false
    state.data = null
  },

  [UPDATE_INVOICE]: (state, action) => {
    const invoiceIndex = state.invoices.findIndex(
      invoice => invoice.r_hash.toString('hex') === action.invoice.r_hash.toString('hex')
    )
    // update if exists or add new otherwise
    if (invoiceIndex >= 0) {
      state.invoices[invoiceIndex] = { ...state.invoices[invoiceIndex], ...action.invoice }
    } else {
      state.invoices.push(action.invoice)
    }
  },
}

// ------------------------------------
// Selectors
// ------------------------------------

const invoiceSelectors = {}
const invoiceSelector = state => state.invoice.invoice
const invoicesSelector = state => state.invoice.invoices

invoiceSelectors.invoices = createSelector(
  invoicesSelector,
  invoices => invoices.map(decorateInvoice)
)

invoiceSelectors.invoiceModalOpen = createSelector(
  invoiceSelector,
  invoice => Boolean(invoice)
)
invoiceSelectors.invoice = createSelector(
  invoiceSelectors.invoices,
  invoiceSelector,
  (invoices, invoice) => invoices.find(item => item.payment_request === invoice)
)

export { invoiceSelectors }

export default createReducer(initialState, ACTION_HANDLERS)
