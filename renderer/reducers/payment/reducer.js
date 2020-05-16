import config from 'config'
import uniqBy from 'lodash/uniqBy'
import find from 'lodash/find'
import createReducer from '@zap/utils/createReducer'
import errorToUserFriendly from '@zap/utils/userFriendlyErrors'
import { isPubkey } from '@zap/utils/crypto'
import delay from '@zap/utils/delay'
import genId from '@zap/utils/genId'
import { mainLog } from '@zap/utils/log'
import { CoinBig } from '@zap/utils/coin'
import { grpc } from 'workers'
import { fetchBalance } from 'reducers/balance'
import { fetchChannels } from 'reducers/channels'
import { infoSelectors } from 'reducers/info'
import { paymentsSending } from './selectors'
import { prepareKeysendPayload, prepareBolt11Payload } from './utils'
import * as constants from './constants'

const {
  GET_PAYMENTS,
  RECEIVE_PAYMENTS,
  SEND_PAYMENT,
  PAYMENT_SUCCESSFUL,
  PAYMENT_FAILED,
  PAYMENT_COMPLETED,
  DECREASE_PAYMENT_RETRIES,
  PAYMENT_STATUS_SENDING,
  PAYMENT_STATUS_SUCCESSFUL,
  PAYMENT_STATUS_FAILED,
} = constants

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

export const paymentComplete = paymentId => async dispatch => {
  const { payments } = await grpc.services.Lightning.listPayments({
    maxPayments: 3,
    indexOffset: 0,
    reversed: true,
  })
  dispatch(receivePayments(payments))
  dispatch({ type: PAYMENT_COMPLETED, paymentId })
}

/**
 * paymentSuccessful - Success handler for payInvoice.
 *
 * @param {{paymentId}} paymentId Payment id (internal)
 * @returns {Function} Thunk
 */
export const paymentSuccessful = ({ paymentId }) => async (dispatch, getState) => {
  const paymentSending = find(paymentsSending(getState()), { paymentId })

  // If we found a related entry in paymentsSending, gracefully remove it and handle as success case.
  if (paymentSending) {
    const { creationDate } = paymentSending

    // Ensure payment stays in sending state for at least 1 second.
    await delay(1000 - (Date.now() - creationDate * 1000))

    // Mark the payment as successful.
    dispatch({ type: PAYMENT_SUCCESSFUL, paymentId })

    // Wait for another 3 seconds.
    await delay(3000)

    dispatch(paymentComplete(paymentId))
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
  const paymentSending = find(paymentsSending(getState()), { paymentId })

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
    if (paymentRequest && remainingRetries && RETRIABLE_ERRORS.includes(error)) {
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
 * @param {number} options.route Specific route to use.
 * @param {number} options.retries Number of remaining retries
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
  const routerSendPayment = infoSelectors.hasSendPaymentV2Support(getState())
    ? grpc.services.Router.sendPaymentV2
    : grpc.services.Router.sendPayment
  const paymentId = originalPaymentId || genId()
  const isKeysend = isPubkey(payReq)
  let payload

  // Prepare payload for lnd.
  if (isKeysend) {
    payload = prepareKeysendPayload(payReq, amt, feeLimit)
  } else {
    payload = prepareBolt11Payload(payReq, amt, feeLimit)
  }

  // Add id into the payload as a way to allow identification later.
  payload.paymentId = paymentId

  // If we already have an id then this is a retry. Decrease the retry count.
  // Otherwise, add to paymentsSending in the state.
  if (originalPaymentId) {
    dispatch(decPaymentRetry(originalPaymentId))
  } else {
    dispatch(
      sendPayment({
        paymentId,
        feeLimit,
        value: amt,
        remainingRetries: retries,
        paymentRequest: payload.paymentRequest,
        dest: payload.dest && payload.dest.toString('hex'),
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
            data = await routerSendPayment(payload)
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
        data = await routerSendPayment(payload)
      }
    }

    // For older versions use the legacy Lightning.sendPayment method.
    else {
      data = await routerSendPayment(payload)
    }

    dispatch(paymentSuccessful(data))
  } catch (e) {
    const { details, message } = e
    dispatch(paymentFailed(message, details))
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
    state.payments = uniqBy(payments.concat(state.payments), 'paymentHash')
  },
  [SEND_PAYMENT]: (state, { payment }) => {
    state.paymentsSending.push(payment)
  },
  [DECREASE_PAYMENT_RETRIES]: (state, { paymentId }) => {
    const item = find(state.paymentsSending, { paymentId })
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
    const item = find(state.paymentsSending, { paymentId })
    if (item) {
      item.status = PAYMENT_STATUS_SUCCESSFUL
    }
  },
  [PAYMENT_COMPLETED]: (state, { paymentId }) => {
    state.paymentsSending = state.paymentsSending.filter(item => item.paymentId !== paymentId)
  },
  [PAYMENT_FAILED]: (state, { paymentId, error }) => {
    const item = find(state.paymentsSending, { paymentId })
    if (item) {
      item.status = PAYMENT_STATUS_FAILED
      item.error = error
    }
  },
}

export default createReducer(initialState, ACTION_HANDLERS)
