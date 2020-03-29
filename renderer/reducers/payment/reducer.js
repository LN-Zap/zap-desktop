import config from 'config'
import uniqBy from 'lodash/uniqBy'
import find from 'lodash/find'
import createReducer from '@zap/utils/createReducer'
import errorToUserFriendly from '@zap/utils/userFriendlyErrors'
import { getIntl } from '@zap/i18n'
import { decodePayReq, getTag, isPubkey, generatePreimage } from '@zap/utils/crypto'
import delay from '@zap/utils/delay'
import genId from '@zap/utils/genId'
import { sha256digest } from '@zap/utils/sha256'
import { mainLog } from '@zap/utils/log'
import { CoinBig } from '@zap/utils/coin'
import { grpc } from 'workers'
import { fetchBalance } from 'reducers/balance'
import { fetchChannels } from 'reducers/channels'
import { infoSelectors } from 'reducers/info'
import { showError } from 'reducers/notification'
import messages from './messages'
import paymentSelectors from './selectors'
import * as constants from './constants'

const {
  GET_PAYMENTS,
  RECEIVE_PAYMENTS,
  SEND_PAYMENT,
  PAYMENT_SUCCESSFUL,
  PAYMENT_FAILED,
  DECREASE_PAYMENT_RETRIES,
  PAYMENT_STATUS_SENDING,
  PAYMENT_STATUS_SUCCESSFUL,
  PAYMENT_STATUS_FAILED,
  DEFAULT_CLTV_DELTA,
  KEYSEND_PREIMAGE_TYPE,
} = constants

// ------------------------------------
// Constants
// ------------------------------------

const PAYMENT_TIMEOUT = config.invoices.paymentTimeout

// ------------------------------------
// Initial State
// ------------------------------------

const initialState = {
  paymentLoading: false,
  payments: [],
  paymentsSending: [],
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
 * receivePayments - Fetch payments success callback.
 *
 * @param {Array} payments list of payments.
 * @returns {Function} Thunk
 */
export const receivePayments = payments => dispatch => {
  dispatch({
    type: RECEIVE_PAYMENTS,
    payments,
  })
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
 * sendPayment - After initiating a lightning payment, store details of it in paymentSending array.
 *
 * @param {object} data Payment data
 * @returns {Function} Thunk
 */
export const sendPayment = data => dispatch => {
  if (!data.paymentHash) {
    dispatch(showError(getIntl().formatMessage(messages.payment_send_error)))
    return
  }

  const payment = {
    ...data,
    status: PAYMENT_STATUS_SENDING,
    isSending: true,
    creationDate: Math.round(new Date() / 1000),
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
 * updatePayment - Updates specified payment request.
 *
 * @param {string} paymentRequest Payment request
 * @returns {Function} Thunk
 */
export const updatePayment = paymentRequest => async dispatch => {
  const { payments } = await grpc.services.Lightning.listPayments()
  const payment = payments.find(p => p.paymentRequest === paymentRequest)
  if (payment) {
    dispatch(receivePayments([payment]))
  }
}

/**
 * paymentSuccessful - Success handler for payInvoice.
 *
 * @param {{paymentRequest}} paymentRequest Payment request
 * @returns {Function} Thunk
 */
export const paymentSuccessful = ({ paymentId }) => async (dispatch, getState) => {
  const paymentSending = find(paymentSelectors.paymentsSendingSelector(getState()), { paymentId })

  // If we found a related entry in paymentsSending, gracefully remove it and handle as success case.
  if (paymentSending) {
    const { creationDate, paymentRequest } = paymentSending

    // Ensure payment stays in sending state for at least 2 seconds.
    await delay(2000 - (Date.now() - creationDate * 1000))

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
  const paymentSending = find(paymentSelectors.paymentsSendingSelector(getState()), { paymentId })

  // errors that trigger retry mechanism
  const RETRIABLE_ERRORS = [
    'payment attempt not completed before timeout', // ErrPaymentAttemptTimeout
    'unable to find a path to destination', // ErrNoPathFound
    'target not found', // ErrTargetNotInNetwork
    'FAILED_NO_ROUTE',
    'FAILED_ERROR',
    'FAILED_TIMEOUT',
    'TERMINATED_EARLY', // Triggered if sendPayment aborts without giveing a proper response.
  ]

  // If we found a related entery in paymentsSending, gracefully remove it and handle as error case.
  if (paymentSending) {
    const { creationDate, paymentRequest, remainingRetries, maxRetries } = paymentSending
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
      await delay(2000 - (Date.now() - creationDate * 1000))

      // Mark the payment as failed.
      dispatch({ type: PAYMENT_FAILED, paymentId, error: errorToUserFriendly(error) })
    }
  }
}

/**
 * payInvoice - Pay a lightniung invoice.
 * Controller code that wraps the send action and schedules automatic retries in the case of a failure.
 *
 * @param {object} options Options
 * @param {string} options.payReq Payment request or node pubkey
 * @param {number} options.amt Payment amount (in sats)
 * @param {number} options.feeLimit The max fee to apply
 * @param {number} options.retries Number of remaining retries
 * @param {number} options.route Specific route to use.
 * @param {string} options.originalPaymentId Id of the original payment if (required if this is a payment retry)
 * @returns {Function} Thunk
 */
export const payInvoice = ({
  payReq,
  amt,
  feeLimit,
  route,
  retries = 0,
  originalPaymentId,
}) => async (dispatch, getState) => {
  const paymentId = originalPaymentId || genId()
  const isKeysend = isPubkey(payReq)
  let pubkey
  let paymentHash
  let paymentRequest

  let payload = {
    paymentId,
    feeLimit: feeLimit ? { fixed: feeLimit } : null,
    allowSelfPayment: true,
  }

  // Keysend payment.
  if (isKeysend) {
    pubkey = payReq
    const preimage = generatePreimage()
    paymentHash = sha256digest(preimage)

    payload = {
      ...payload,
      paymentHash,
      amt,
      finalCltvDelta: DEFAULT_CLTV_DELTA,
      dest: Buffer.from(pubkey, 'hex'),
      destCustomRecords: {
        [KEYSEND_PREIMAGE_TYPE]: preimage,
      },
    }
  }

  // Bolt11 invoice payment.
  else {
    const invoice = decodePayReq(payReq)
    const { millisatoshis } = invoice
    paymentHash = getTag(invoice, 'payment_hash')
    pubkey = invoice.payeeNodeKey
    paymentRequest = invoice.paymentRequest // eslint-disable-line prefer-destructuring
    payload = {
      ...payload,
      amt: millisatoshis ? null : amt,
      paymentRequest,
    }
  }

  // If we already have an id then this is a retry. Decrease the retry count.
  // Otherwise, add to paymentsSending in the state.
  if (originalPaymentId) {
    dispatch(decPaymentRetry(originalPaymentId))
  } else {
    dispatch(
      sendPayment({
        path: [pubkey],
        paymentHash,
        paymentId,
        feeLimit,
        value: amt,
        remainingRetries: retries,
        paymentRequest,
        maxRetries: retries,
        isKeysend,
      })
    )
  }

  // Submit the payment to LND.
  try {
    let data = { paymentId }

    // Use Router service if lnd version supports it.
    if (infoSelectors.hasRouterSupport(getState())) {
      payload = {
        ...payload,
        feeLimit,
        timeoutSeconds: PAYMENT_TIMEOUT,
      }

      // If we have been supplied with exact route, attempt to use that route.
      if (route && route.isExact) {
        let result = {}
        try {
          const routeToUse = { ...route }
          delete routeToUse.isExact
          delete routeToUse.paymentHash
          result = await grpc.services.Router.sendToRoute({
            paymentHash: route.paymentHash ? Buffer.from(route.paymentHash, 'hex') : null,
            route: routeToUse,
          })
        } catch (error) {
          if (error.message === 'unknown service routerrpc.Router') {
            // We don't know for sure that the node has been compiled with the Router service.
            // Fall bak to using sendPayment in the event of an error.
            mainLog.warn('Unable to pay invoice using sendToRoute: %s', error.message)
            data = await grpc.services.Router.sendPayment(payload)
          } else {
            error.details = data
            throw error
          }
        }
        if (result.failure) {
          const error = new Error(result.failure.code)
          error.details = data
          throw error
        }
      }

      // Otherwise, just use sendPayment.
      else {
        data = await grpc.services.Router.sendPayment(payload)
      }
    }

    // For older versions use the legacy Lightning.sendPayment method.
    else {
      data = await grpc.services.Lightning.sendPayment(payload)
    }

    dispatch(paymentSuccessful(data))
  } catch (e) {
    const { payload: data, message: error } = e
    dispatch(paymentFailed(error, data))
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
    state.payments = uniqBy(state.payments.concat(payments), 'paymentHash')
    state.paymentsSending = state.paymentsSending.filter(
      item => !payments.find(p => p.paymentHash === item.paymentHash)
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
        item.feeLimit = CoinBig(item.feeLimit)
          .times(config.invoices.feeIncrementExponent)
          .decimalPlaces(0)
          .toString()
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

export default createReducer(initialState, ACTION_HANDLERS)
