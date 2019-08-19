import { createSelector } from 'reselect'
import { showSystemNotification } from '@zap/utils/notifications'
import { convert } from '@zap/utils/btc'
import { getIntl } from '@zap/i18n'
import { grpc } from 'workers'
import { fetchBalance } from './balance'
import { fetchChannels } from './channels'
import { showError } from './notification'
import { walletSelectors } from './wallet'
import { settingsSelectors } from './settings'
import createReducer from './utils/createReducer'
import messages from './messages'

// ------------------------------------
// Initial State
// ------------------------------------

const initialState = {
  isInvoicesLoading: false,
  createInvoiceError: null,
  invoices: [],
  invoice: null,
}

// ------------------------------------
// Constants
// ------------------------------------

export const SET_INVOICE = 'SET_INVOICE'
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
 * @param {object} options request options
 * @param {number} options.amount Amount
 * @param {string} options.cryptoUnit Crypto unit (sats, bits, btc)
 * @param {string} options.memo Memo
 * @param {boolean} options.isPrivate Set to true to include routing hints
 * @param {string} options.fallbackAddress on-chain address fallback
 * @returns {Function} Thunk
 */
export const createInvoice = ({ amount, cryptoUnit, memo, isPrivate, fallbackAddress }) => async (
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
      fallback_addr: fallbackAddress,
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
  dispatch({ type: INVOICE_FAILED, error: error.message })
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
    const intl = getIntl()
    // HTML 5 desktop notification for the invoice update
    const notifTitle = intl.formatMessage(messages.invoice_receive_title)
    const notifBody = intl.formatMessage(messages.invoice_receive_body)

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
  [GET_INVOICES]: state => {
    state.isInvoicesLoading = true
  },
  [RECEIVE_INVOICES]: (state, { invoices }) => {
    state.isInvoicesLoading = false
    state.invoices = invoices
  },
  [SEND_INVOICE]: state => {
    state.isInvoicesLoading = true
  },
  [INVOICE_SUCCESSFUL]: state => {
    state.isInvoicesLoading = false
    state.createInvoiceError = null
  },
  [INVOICE_FAILED]: (state, { error }) => {
    state.isInvoicesLoading = false
    state.createInvoiceError = error
  },
  [UPDATE_INVOICE]: (state, { invoice }) => {
    const invoiceIndex = state.invoices.findIndex(
      invoice => invoice.r_hash.toString('hex') === invoice.r_hash.toString('hex')
    )
    // update if exists or add new otherwise
    if (invoiceIndex >= 0) {
      state.invoices[invoiceIndex] = { ...state.invoices[invoiceIndex], ...invoice }
    } else {
      state.invoices.push(invoice)
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
