import config from 'config'
import { createSelector } from 'reselect'
import uniqBy from 'lodash/uniqBy'
import find from 'lodash/find'
import createReducer from '@zap/utils/createReducer'
import errorToUserFriendly from '@zap/utils/userFriendlyErrors'
import { getIntl } from '@zap/i18n'
import { decodePayReq, getNodeAlias, getTag } from '@zap/utils/crypto'
import { convert } from '@zap/utils/btc'
import delay from '@zap/utils/delay'
import genId from '@zap/utils/genId'
import { grpc } from 'workers'
import { fetchBalance } from './balance'
import { fetchChannels } from './channels'
import { networkSelectors } from './network'
import { showError } from './notification'
import messages from './messages'

// ------------------------------------
// Initial State
// ------------------------------------

const initialState = {
  paymentLoading: false,
  payments: [],
  paymentsSending: [],
}

// ------------------------------------
// Constants
// ------------------------------------

export const SET_PAYMENT = 'SET_PAYMENT'
export const GET_PAYMENTS = 'GET_PAYMENTS'
export const RECEIVE_PAYMENTS = 'RECEIVE_PAYMENTS'
export const SEND_PAYMENT = 'SEND_PAYMENT'
export const PAYMENT_SUCCESSFUL = 'PAYMENT_SUCCESSFUL'
export const PAYMENT_FAILED = 'PAYMENT_FAILED'
export const DECREASE_PAYMENT_RETRIES = 'DECREASE_PAYMENT_RETRIES'

const PAYMENT_STATUS_SENDING = 'sending'
const PAYMENT_STATUS_SUCCESSFUL = 'successful'
const PAYMENT_STATUS_FAILED = 'failed'

// ------------------------------------
// Helpers
// ------------------------------------

/**
 * decoratePayment - Decorate payment object with custom/computed properties.
 *
 * @param  {object} payment Payment
 * @param  {Array} nodes Nodes
 * @returns {object} Decorated payment
 */
const decoratePayment = (payment, nodes = []) => {
  // Add basic type information.
  const decoration = {
    type: 'payment',
  }

  // Older versions of lnd provided the sat amount in `value`.
  // This is now deprecated in favor of `value_sat` and `value_msat`.
  // Patch data returned from older clients to match the current format for consistency.
  const { value } = payment
  if (value && (!payment.value_sat || !payment.value_msat)) {
    Object.assign(decoration, {
      value_sat: value,
      value_msat: convert('sats', 'msats', value),
    })
  }

  // First try to get the pubkey from payment.path
  let pubkey = payment.path && payment.path[payment.path.length - 1]

  // If we don't have a pubkey, try to get it from the payment request.
  if (!pubkey && payment.paymentRequest) {
    const paymentRequest = decodePayReq(payment.paymentRequest)
    pubkey = paymentRequest.payeeNodeKey
  }

  // Try to add some info about the destination of the payment.
  if (pubkey) {
    Object.assign(decoration, {
      dest_node_pubkey: pubkey,
      dest_node_alias: getNodeAlias(pubkey, nodes),
    })
  }

  return {
    ...payment,
    ...decoration,
  }
}

// ------------------------------------
// Actions
// ------------------------------------

/**
 * getPayments - Initiate fetching all payments.
 *
 * @returns {object} Action
 */
export function getPayments() {
  return {
    type: GET_PAYMENTS,
  }
}

/**
 * sendPayment - After initiating a lightning payment, store details of it in paymentSending array.
 *
 * @param {object} data Payment data
 * @returns {Function} Thunk
 */
export const sendPayment = data => dispatch => {
  const invoice = decodePayReq(data.paymentRequest)
  const paymentHash = getTag(invoice, 'payment_hash')

  if (!paymentHash) {
    dispatch(showError(getIntl().formatMessage(messages.payment_send_error)))
    return
  }

  const payment = {
    ...data,
    status: PAYMENT_STATUS_SENDING,
    isSending: true,
    creation_date: Math.round(new Date() / 1000),
    payment_hash: paymentHash,
  }

  dispatch({
    type: SEND_PAYMENT,
    payment,
  })
}

/**
 * fetchPayments - Fetch details of all lightning payments.
 *
 * @returns {Function} Thunk
 */
export const fetchPayments = () => async dispatch => {
  dispatch(getPayments())
  const { payments } = await grpc.services.Lightning.listPayments()
  dispatch(receivePayments(payments))
}

/**
 * receivePayments - Fetch payments success callback.
 *
 * @param {Array} payments list of payments.
 * @returns {Function} Thunk
 */
export const receivePayments = payments => dispatch => {
  dispatch({ type: RECEIVE_PAYMENTS, payments })
}

/**
 * decPaymentRetry - Decrement payment request retry count.
 *
 * @param {string} paymentId Internal id of payment whose retry count to decrease
 * @returns {object} Action
 */
const decPaymentRetry = paymentId => ({
  type: DECREASE_PAYMENT_RETRIES,
  paymentId,
})

/**
 * payInvoice - Pay a lightniung invoice.
 * Controller code that wraps the send action and schedules automatic retries in the case of a failure.
 *
 * @param {object} options Options
 * @param {string} options.payReq Payment request
 * @param {number} options.amt Payment amount (in sats)
 * @param {number} options.feeLimit The max fee to apply
 * @param {number} options.retries Number of remaining retries
 * @param {string} options.originalPaymentId Id of the original payment if (required if this is a payment retry)
 * @returns {Function} Thunk
 */
export const payInvoice = ({
  payReq,
  amt,
  feeLimit,
  retries = 0,
  originalPaymentId,
}) => async dispatch => {
  let paymentId = originalPaymentId

  // If we already have an id then this is a retry. Decrease the retry count.
  if (originalPaymentId) {
    dispatch(decPaymentRetry(originalPaymentId))
  }

  // Otherwise, add to paymentsSending in the state.
  else {
    // Generate a unique id for the payment that we will use to track the payment across retry attempts.
    paymentId = genId()

    dispatch(
      sendPayment({
        paymentId,
        paymentRequest: payReq,
        feeLimit,
        value: amt,
        remainingRetries: retries,
        maxRetries: retries,
      })
    )
  }

  // Submit the payment to LND.
  try {
    const data = await grpc.services.Lightning.sendPayment({
      paymentId,
      payment_request: payReq,
      amt,
      fee_limit: { fixed: feeLimit },
    })
    dispatch(paymentSuccessful(data))
  } catch (e) {
    const { details: data, message: error } = e
    dispatch(paymentFailed(error, data))
  }
}

/**
 * updatePayment - Updates specified payment request.
 *
 * @param {string} paymentRequest Payment request
 * @returns {Function} Thunk
 */
export const updatePayment = paymentRequest => async dispatch => {
  const { payments } = await grpc.services.Lightning.listPayments()
  const payment = payments.find(p => p.payment_request === paymentRequest)
  if (payment) {
    dispatch(receivePayments([payment]))
  }
}

/**
 * paymentSuccessful - Success handler for payInvoice.
 *
 * @param {{payment_request}} payment_request Payment request
 * @returns {Function} Thunk
 */
export const paymentSuccessful = ({ paymentId }) => async (dispatch, getState) => {
  const paymentSending = find(paymentsSendingSelector(getState()), { paymentId })

  // If we found a related entry in paymentsSending, gracefully remove it and handle as success case.
  if (paymentSending) {
    const { creation_date, paymentRequest } = paymentSending

    // Ensure payment stays in sending state for at least 2 seconds.
    await delay(2000 - (Date.now() - creation_date * 1000))

    // Mark the payment as successful.
    dispatch({ type: PAYMENT_SUCCESSFUL, paymentId })

    // Wait for another second.
    await delay(1500)

    dispatch(updatePayment(paymentRequest))
  }

  // Fetch new balance.
  dispatch(fetchBalance())

  // Fetch updated channels.
  dispatch(fetchChannels())
}

/**
 * paymentFailed - Error handler for payInvoice.
 *
 * @param {Error} error Error
 * @param {object} details Failed payment details
 *
 * @returns {Function} Thunk
 */
export const paymentFailed = (error, { paymentId }) => async (dispatch, getState) => {
  const paymentSending = find(paymentsSendingSelector(getState()), { paymentId })

  // errors that trigger retry mechanism
  const RETRIABLE_ERRORS = [
    'payment attempt not completed before timeout', // ErrPaymentAttemptTimeout
    'unable to find a path to destination', // ErrNoPathFound
    'target not found', // ErrTargetNotInNetwork
  ]

  // If we found a related entery in paymentsSending, gracefully remove it and handle as error case.
  if (paymentSending) {
    const { creation_date, paymentRequest, remainingRetries, maxRetries } = paymentSending
    // if we have retries left and error is eligible for retry - rebroadcast payment
    if (remainingRetries && RETRIABLE_ERRORS.includes(error)) {
      const data = {
        ...paymentSending,
        payReq: paymentRequest,
        originalPaymentId: paymentId,
      }
      const retryIndex = maxRetries - remainingRetries + 1
      // add increasing delay
      await delay(config.invoices.baseRetryDelay * retryIndex * retryIndex)
      dispatch(payInvoice(data))
    } else {
      // Ensure payment stays in sending state for at least 2 seconds.
      await delay(2000 - (Date.now() - creation_date * 1000))

      // Mark the payment as failed.
      dispatch({ type: PAYMENT_FAILED, paymentId, error: errorToUserFriendly(error) })
    }
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------

const ACTION_HANDLERS = {
  [GET_PAYMENTS]: state => {
    state.paymentLoading = true
  },
  [RECEIVE_PAYMENTS]: (state, { payments }) => {
    state.paymentLoading = false
    state.payments = uniqBy(state.payments.concat(payments), 'payment_hash')
    state.paymentsSending = state.paymentsSending.filter(
      item => !payments.find(p => p.payment_hash === item.payment_hash)
    )
  },
  [SEND_PAYMENT]: (state, { payment }) => {
    state.paymentsSending.push(payment)
  },

  [DECREASE_PAYMENT_RETRIES]: (state, { paymentId }) => {
    const { paymentsSending } = state
    const item = find(paymentsSending, { paymentId })
    if (item) {
      item.remainingRetries = Math.max(item.remainingRetries - 1, 0)
      if (item.feeLimit) {
        item.feeLimit = Math.ceil(item.feeLimit * config.invoices.feeIncrementExponent)
      }
    }
  },
  [PAYMENT_SUCCESSFUL]: (state, { paymentId }) => {
    const { paymentsSending } = state
    const item = find(paymentsSending, { paymentId })
    if (item) {
      item.status = PAYMENT_STATUS_SUCCESSFUL
    }
  },
  [PAYMENT_FAILED]: (state, { paymentId, error }) => {
    const { paymentsSending } = state
    const item = find(paymentsSending, { paymentId })
    if (item) {
      item.status = PAYMENT_STATUS_FAILED
      item.error = error
    }
  },
}

// ------------------------------------
// Selectors
// ------------------------------------

const paymentSelectors = {}
const modalPaymentSelector = state => state.payment.payment
const paymentsSelector = state => state.payment.payments
const paymentsSendingSelector = state => state.payment.paymentsSending
const nodesSelector = state => networkSelectors.nodes(state)

paymentSelectors.payments = createSelector(
  paymentsSelector,
  nodesSelector,
  (payments, nodes) => payments.map(payment => decoratePayment(payment, nodes))
)

paymentSelectors.paymentsSending = createSelector(
  paymentsSendingSelector,
  nodesSelector,
  (paymentsSending, nodes) => paymentsSending.map(payment => decoratePayment(payment, nodes))
)

paymentSelectors.paymentModalOpen = createSelector(
  modalPaymentSelector,
  payment => !!payment
)

export { paymentSelectors }

export default createReducer(initialState, ACTION_HANDLERS)
