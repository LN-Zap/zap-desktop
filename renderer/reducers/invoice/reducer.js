import uniqBy from 'lodash/uniqBy'
import createReducer from '@zap/utils/createReducer'
import { showSystemNotification } from '@zap/utils/notifications'
import { convert } from '@zap/utils/btc'
import { getIntl } from '@zap/i18n'
import { grpc } from 'workers'
import { fetchBalance } from 'reducers/balance'
import { fetchChannels } from 'reducers/channels'
import { showError } from 'reducers/notification'
import { walletSelectors } from 'reducers/wallet'
import { settingsSelectors } from 'reducers/settings'
import { decorateInvoice } from './utils'
import messages from './messages'
import * as constants from './constants'

const {
  SET_INVOICE,
  GET_INVOICES,
  RECEIVE_INVOICES,
  SEND_INVOICE,
  INVOICE_SUCCESSFUL,
  INVOICE_FAILED,
  UPDATE_INVOICE,
} = constants

/**
 * @typedef Invoice
 * @property {object[]} routeHints Route hints that can be used to assist in reaching the invoice's destination
 * @property {object[]} htlcs List of HTLCs paying to this invoice
 * @property {object} features List of features advertised on the invoice
 * @property {string} memo An optional memo to attach along with the invoice
 * @property {string} rPreimage The hex-encoded preimage (32 byte)
 * @property {string} rHash The hash of the preimage
 * @property {string} value The value of this invoice in satoshis
 * @property {boolean} settled Whether this invoice has been fulfilled
 * @property {string} creationDate When this invoice was created
 * @property {string} settleDate When this invoice was settled
 * @property {string} paymentRequest A bare-bones invoice for a payment within the Lightning Network
 * @property {object} descriptionHash Hash (SHA-256) of a description of the payment
 * @property {string} expiry Payment request expiry time in seconds
 * @property {string} fallbackAddr Fallback on-chain address
 * @property {string} cltvExpiry Delta to use for the time-lock of the CLTV extended to the final hop
 * @property {boolean} private Whether this invoice should include routing hints for private channels
 * @property {string} addIndex The "add" index of this invoice
 * @property {string} settleIndex The "settle" index of this invoice
 * @property {string} amtPaid Deprecated, use amt_paid_sat or amt_paid_msat
 * @property {string} amtPaidSat The amount that was accepted for this invoice, in satoshis
 * @property {string} amtPaidMsat The amount that was accepted for this invoice, in millisatoshis
 * @property {'OPEN'|'SETTLED'|'CANCELED'|'ACCEPTED'} state The state the invoice is in
 * @property {string} valueMsat The value of this invoice in millisatoshis
 * @property {boolean} isKeysend Indicates if this invoice was a spontaneous payment that arrived via keysend
 */

/**
 * @typedef State
 * @property {boolean} isInvoicesLoading Boolean indicating if invoices are loading.
 * @property {Error|null} createInvoiceError Error from loading activity.
 * @property {Invoice[]} invoices List of invoices.
 * @property {string|null} invoice Currently selected invoice (payment request)
 */

// ------------------------------------
// Initial State
// ------------------------------------

/** @type {State} */
const initialState = {
  isInvoicesLoading: false,
  createInvoiceError: null,
  invoices: [],
  invoice: null,
}

// ------------------------------------
// Actions
// ------------------------------------

/**
 * setInvoice - Set the active invoice.
 *
 * @param {string} paymentRequest Payment request
 * @returns {object} Action
 */
export function setInvoice(paymentRequest) {
  return {
    type: SET_INVOICE,
    invoice: paymentRequest,
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
 * @param {Invoice[]} invoices List of invoices
 * @returns {(dispatch:Function) => void} Thunk
 */
export const receiveInvoices = invoices => dispatch => {
  dispatch({ type: RECEIVE_INVOICES, invoices })
}

/**
 * createInvoiceSuccess - Create invoice success handler.
 *
 * @param {Invoice} invoice Invoice
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
 * createInvoice - Create an invoice.
 *
 * @param {object} options request options
 * @param {number} options.amount Amount
 * @param {string} options.cryptoUnit Crypto unit (sats, bits, btc)
 * @param {string} options.memo Memo
 * @param {boolean} options.isPrivate Set to true to include routing hints
 * @param {string} options.fallbackAddr on-chain address fallback
 * @returns {(dispatch:Function, getState:Function) => Promise<void>} Thunk
 */
export const createInvoice = ({ amount, cryptoUnit, memo, isPrivate, fallbackAddr }) => async (
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
      fallbackAddr,
    })
    dispatch(createInvoiceSuccess(invoice))
    return invoice
  } catch (error) {
    dispatch(createInvoiceFailure(error))
    return null
  }
}

/**
 * receiveInvoiceData - Listen for invoice updates pushed from backend from invoices stream.
 *
 * @param {Invoice} invoice Invoice
 * @returns {(dispatch:Function) => void} Thunk
 */
export const receiveInvoiceData = invoice => dispatch => {
  dispatch({ type: UPDATE_INVOICE, invoice })

  const decoratedInvoice = decorateInvoice(invoice)

  if (decoratedInvoice.isSettled) {
    // Fetch new balance
    dispatch(fetchBalance())

    // Fetch updated channels.
    dispatch(fetchChannels())

    // HTML 5 desktop notification for the invoice update
    const intl = getIntl()
    const notifTitle = intl.formatMessage(messages.invoice_receive_title)
    const notifBody = intl.formatMessage(
      decoratedInvoice.isKeysend
        ? messages.invoice_keysend_receive_body
        : messages.invoice_receive_body
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

export default createReducer(initialState, ACTION_HANDLERS)
