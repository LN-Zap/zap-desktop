import { createSelector } from 'reselect'
import uniqBy from 'lodash/uniqBy'
import createReducer from '@zap/utils/createReducer'
import { showSystemNotification } from '@zap/utils/notifications'
import { convert } from '@zap/utils/btc'
import { getIntl } from '@zap/i18n'
import { grpc } from 'workers'
import { fetchBalance } from './balance'
import { fetchChannels } from './channels'
import { showError } from './notification'
import { walletSelectors } from './wallet'
import { settingsSelectors } from './settings'
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

  const { amtPaid, amtPaidSat, value, amtPaidMsat } = invoice

  // Older versions of lnd provided the sat amount in `value`.
  // This is now deprecated in favor of `valueSat` and `valueMsat`.
  // Patch data returned from older clients to match the current format for consistency.
  if (amtPaid && (!amtPaidSat || !amtPaidMsat)) {
    Object.assign(decoration, {
      amtPaidSat: amtPaid,
      amtPaidMsat: convert('sats', 'msats', amtPaid),
    })
  }

  decoration.finalAmount = amtPaidSat && amtPaidSat !== '0' ? amtPaidSat : value

  // Add an `isExpired` prop which shows whether the invoice is expired or not.
  const expiresAt = parseInt(invoice.creationDate, 10) + parseInt(invoice.expiry, 10)
  decoration.isExpired = expiresAt < Math.round(new Date() / 1000)

  // Older versions of lnd provided the settled state in `settled`
  // This is now deprecated in favor of `state=SETTLED
  // Add an `isSettled` prop which shows whether the invoice is settled or not.
  decoration.isSettled = invoice.state ? invoice.state === 'SETTLED' : invoice.settled

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
 * receiveInvoices - Receive details of all invoice.
 *
 * @param {Array} invoices List of invoices
 * @returns {(dispatch:Function) => void} Thunk
 */
export const receiveInvoices = invoices => dispatch => {
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
      fallbackAddress,
    })
    dispatch(createInvoiceSuccess(invoice))
    return invoice
  } catch (error) {
    dispatch(createInvoiceFailure(error))
    return null
  }
}

/**
 * createInvoiceSuccess - Create invoice success handler.
 *
 * @param {object} invoice Invoice
 * @returns {(dispatch:Function) => void} Thunk
 */
export const createInvoiceSuccess = invoice => dispatch => {
  // Add new invoice to invoices list
  dispatch({ type: INVOICE_SUCCESSFUL, invoice })

  // Set current invoice to newly created invoice.
  dispatch(setInvoice(invoice.paymentRequest))
}

/**
 * createInvoiceFailure - Create invoice error handler.
 *
 * @param {Error} error Error
 * @returns {(dispatch:Function) => void} Thunk
 */
export const createInvoiceFailure = error => dispatch => {
  dispatch({ type: INVOICE_FAILED, error: error.message })
  dispatch(showError(error.message))
}

/**
 * receiveInvoiceData - Listen for invoice updates pushed from backend from invoices stream.
 *
 * @param {object} invoice Invoice
 * @returns {(dispatch:Function) => void} Thunk
 */
export const receiveInvoiceData = invoice => dispatch => {
  dispatch({ type: UPDATE_INVOICE, invoice })

  // Fetch new balance
  dispatch(fetchBalance())

  // Fetch updated channels.
  dispatch(fetchChannels())

  if (invoice.isSettled) {
    const intl = getIntl()
    // HTML 5 desktop notification for the invoice update
    const notifTitle = intl.formatMessage(messages.invoice_receive_title)
    const notifBody = intl.formatMessage(
      invoice.isKeysend ? messages.keysend_receive_body : messages.invoice_receive_body
    )

    showSystemNotification(notifTitle, { body: notifBody })
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
    state.invoices = uniqBy(invoices.concat(state.invoices), 'addIndex')
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
      inv => inv.rHash.toString('hex') === invoice.rHash.toString('hex')
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

invoiceSelectors.invoices = createSelector(invoicesSelector, invoices =>
  invoices.map(decorateInvoice)
)

invoiceSelectors.invoiceModalOpen = createSelector(invoiceSelector, invoice => Boolean(invoice))
invoiceSelectors.invoice = createSelector(
  invoiceSelectors.invoices,
  invoiceSelector,
  (invoices, invoice) => invoices.find(item => item.paymentRequest === invoice)
)

export { invoiceSelectors }

export default createReducer(initialState, ACTION_HANDLERS)
