import uniqBy from 'lodash/uniqBy'

import { getIntl } from '@zap/i18n'
import { convert } from '@zap/utils/btc'
import createReducer from '@zap/utils/createReducer'
import { generatePreimage } from '@zap/utils/crypto'
import { showSystemNotification } from '@zap/utils/notifications'
import { sha256digest } from '@zap/utils/sha256'
import { fetchBalance } from 'reducers/balance'
import { fetchChannels } from 'reducers/channels'
import { showError } from 'reducers/notification'
import { settingsSelectors } from 'reducers/settings'
import { walletSelectors } from 'reducers/wallet'
import { grpc } from 'workers'

import * as constants from './constants'
import messages from './messages'
import invoiceSelectors from './selectors'
import { decorateInvoice } from './utils'

const {
  RECEIVE_INVOICES,
  UPDATE_INVOICE,

  ADD_INVOICE,
  ADD_INVOICE_SUCCESS,
  ADD_INVOICE_FAILURE,

  CANCEL_INVOICE,
  CANCEL_INVOICE_SUCCESS,
  CANCEL_INVOICE_FAILURE,

  SETTLE_INVOICE,
  SETTLE_INVOICE_SUCCESS,
  SETTLE_INVOICE_FAILURE,
  CLEAR_SETTLE_INVOICE_ERROR,
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
 * @property {boolean} isInvoiceCreating Boolean indicating if invoices are loading.
 * @property {boolean} isInvoiceCancelling Boolean indicating if invoice is being cancelled.
 * @property {boolean} isInvoiceSettling Boolean indicating if invoice is being settled.
 * @property {string|null} addInvoiceError Error from loading activity.
 * @property {string|null} cancelInvoiceError Error from cancelling invoice.
 * @property {string|null} settleInvoiceError Error from settling invoice.
 * @property {Invoice[]} invoices List of invoices.
 */

// ------------------------------------
// Initial State
// ------------------------------------

/** @type {State} */
const initialState = {
  isInvoiceCreating: false,
  isInvoiceCancelling: false,
  isInvoiceSettling: false,
  addInvoiceError: null,
  cancelInvoiceError: null,
  settleInvoiceError: null,
  invoices: [],
}

// ------------------------------------
// Actions
// ------------------------------------

/**
 * receiveInvoices - Receive details of invoices.
 *
 * @param {Invoice[]} invoices List of invoices
 * @returns {(dispatch:Function) => void} Thunk
 */
export const receiveInvoices = invoices => dispatch => {
  dispatch({ type: RECEIVE_INVOICES, invoices })
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

/**
 * addInvoice - Create an invoice.
 *
 * @param {object} options request options
 * @param {number} options.amount Amount
 * @param {string} options.cryptoUnit Crypto unit (sats, bits, btc)
 * @param {string} [options.memo] Memo
 * @param {boolean} [options.isPrivate] Set to true to include routing hints
 * @param {boolean} [options.isHoldInvoice=false] Set to true to make this a hold invoice
 * @param {string} [options.fallbackAddr] on-chain address fallback
 * @param {string} [options.preimage] on-chain address fallback
 * @returns {(dispatch:Function, getState:Function) => Promise<void>} Thunk
 */
export const addInvoice = ({
  amount,
  cryptoUnit,
  memo,
  isPrivate,
  isHoldInvoice,
  fallbackAddr,
  preimage,
}) => async (dispatch, getState) => {
  dispatch({ type: ADD_INVOICE })
  try {
    // backend needs value in satoshis no matter what currency we are using
    const value = convert(cryptoUnit, 'sats', amount)

    // Grab the activeWallet type from our local store. If the active connection type is local (light clients using
    // neutrino) we will have to flag private as true when creating this invoice. All light cliets open private channels
    // (both manual and autopilot ones). In order for these clients to receive money through these channels the invoices
    // need to come with routing hints for private channels.
    const state = getState()
    const activeWalletSettings = walletSelectors.activeWalletSettings(state)
    const currentConfig = settingsSelectors.currentConfig(state)

    const payload = {
      value,
      memo,
      private: isPrivate || activeWalletSettings.type === 'local',
      expiry: currentConfig.invoices.expire,
      fallbackAddr,
    }
    let paymentRequest

    if (isHoldInvoice) {
      const preimageBytes = preimage ? new TextEncoder().encode(preimage) : generatePreimage()
      const preimageHash = sha256digest(preimageBytes)
      const preimageHashHash = sha256digest(preimageHash)
      payload.hash = preimageHashHash
      ;({ paymentRequest } = await grpc.services.Invoices.addHoldInvoice(payload))
    } else {
      ;({ paymentRequest } = await grpc.services.Lightning.addInvoice(payload))
    }
    dispatch({ type: ADD_INVOICE_SUCCESS })
    return paymentRequest
  } catch (error) {
    dispatch({ type: ADD_INVOICE_FAILURE, error: error.message })
    dispatch(showError(error.message))
    return null
  }
}

/**
 * cancelInvoice - Cancels a currently open invoice.
 *
 * @param  {string} paymentHash Hash corresponding to the (hold) invoice to cancel
 * @returns {(dispatch:Function, getState:Function) => Promise<void>} Thunk
 */
export const cancelInvoice = paymentHash => async (dispatch, getState) => {
  dispatch({ type: CANCEL_INVOICE })
  try {
    await grpc.services.Invoices.cancelInvoice({ paymentHash })
    const invoices = invoiceSelectors.invoices(getState())
    const invoice = invoices.find(i => i.rHash === paymentHash)
    if (invoice) {
      invoice.state = 'CANCELED'
      dispatch(receiveInvoiceData(invoice))
    }
    dispatch({ type: CANCEL_INVOICE_SUCCESS })
  } catch (error) {
    dispatch({ type: CANCEL_INVOICE_FAILURE, error: error.message })
    dispatch(showError(error.message))
  }
}

/**
 * settleInvoice - Settles a currently open invoice.
 *
 * @param  {string} preimage Externally discovered pre-image that should be used to settle the hold / invoice.
 * @returns {(dispatch:Function, getState:Function) => Promise<void>} Thunk
 */
export const settleInvoice = preimage => async (dispatch, getState) => {
  dispatch({ type: SETTLE_INVOICE })
  const preimageBytes = new TextEncoder().encode(preimage)
  const preimageHash = sha256digest(preimageBytes)
  try {
    await grpc.services.Invoices.settleInvoice({ preimage: preimageHash })
    const invoices = invoiceSelectors.invoices(getState())
    const invoice = invoices.find(i => i.rPreimage === preimage)
    if (invoice) {
      invoice.state = 'SETTLED'
      dispatch(receiveInvoiceData(invoice))
    }
    dispatch({ type: SETTLE_INVOICE_SUCCESS })
  } catch (error) {
    dispatch({ type: SETTLE_INVOICE_FAILURE, error: error.message })
  }
}

/**
 * clearSettleInvoiceError - Clear settle invoice error.
 *
 * @returns {(dispatch:Function, getState:Function) => void} Thunk
 */
export const clearSettleInvoiceError = () => (dispatch, getState) => {
  if (invoiceSelectors.settleInvoiceError(getState())) {
    dispatch({ type: CLEAR_SETTLE_INVOICE_ERROR })
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------

const ACTION_HANDLERS = {
  [RECEIVE_INVOICES]: (state, { invoices }) => {
    state.invoices = uniqBy(invoices.concat(state.invoices), 'addIndex')
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

  [ADD_INVOICE]: state => {
    state.isInvoiceCreating = true
  },
  [ADD_INVOICE_SUCCESS]: state => {
    state.isInvoiceCreating = false
    state.addInvoiceError = null
  },
  [ADD_INVOICE_FAILURE]: (state, { error }) => {
    state.isInvoiceCreating = false
    state.addInvoiceError = error
  },

  [CANCEL_INVOICE]: state => {
    state.isInvoiceCancelling = true
  },
  [CANCEL_INVOICE_SUCCESS]: state => {
    state.isInvoiceCancelling = false
    state.cancelInvoiceError = null
  },
  [CANCEL_INVOICE_FAILURE]: (state, { error }) => {
    state.isInvoiceCancelling = false
    state.cancelInvoiceError = error
  },

  [SETTLE_INVOICE]: state => {
    state.isInvoiceSettling = true
  },
  [SETTLE_INVOICE_SUCCESS]: state => {
    state.isInvoiceSettling = false
    state.settleInvoiceError = null
  },
  [SETTLE_INVOICE_FAILURE]: (state, { error }) => {
    state.isInvoiceSettling = false
    state.settleInvoiceError = error
  },
  [CLEAR_SETTLE_INVOICE_ERROR]: state => {
    state.settleInvoiceError = null
  },
}

export default createReducer(initialState, ACTION_HANDLERS)
