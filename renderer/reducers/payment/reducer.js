import cloneDeep from 'lodash/cloneDeep'
import defaults from 'lodash/defaults'
import find from 'lodash/find'
import isNil from 'lodash/isNil'
import omitBy from 'lodash/omitBy'
import pick from 'lodash/pick'
import uniqBy from 'lodash/uniqBy'

import { CoinBig } from '@zap/utils/coin'
import createReducer from '@zap/utils/createReducer'
import { isPubkey, getTag } from '@zap/utils/crypto'
import delay from '@zap/utils/delay'
import genId from '@zap/utils/genId'
import { mainLog } from '@zap/utils/log'
import { fetchBalance } from 'reducers/balance'
import { fetchChannels } from 'reducers/channels'
import { infoSelectors } from 'reducers/info'
import { settingsSelectors } from 'reducers/settings'
import { grpc } from 'workers'

import * as constants from './constants'
import { paymentsSending } from './selectors'
import { prepareKeysendPayload, prepareBolt11Payload, errorCodeToMessage } from './utils'

/**
 * @typedef HtlcEvent
 * @property {string} incomingChannelId The short channel id that the incoming htlc arrived at our node on.
 * @property {string} outgoingChannelId The short channel id that the outgoing htlc left our node on.
 * @property {string} incomingHtlcId Incoming id is the index of the incoming htlc in the incoming channel.
 * @property {string} outgoingHtlcId Outgoing id is the index of the outgoing htlc in the outgoing channel.
 * @property {string} timestampNs The time in unix nanoseconds that the event occurred.
 * @property {string} eventType The event type indicates whether the htlc was part of a send, receive or forward.
 * @property {object} forwardEvent ForwardEvent
 * @property {object} forwardFailEvent ForwardFailEvent
 * @property {object} settleEvent SettleEvent
 * @property {object} linkFailEvent LinkFailEvent
 */

/**
 * @typedef PaymentSending
 * @property {string} paymentId Internal payment id.
 * @property {string} paymentRequest Bol11 payment request.
 * @property {string} feeLimit Max fee (satoshis)
 * @property {number} value Payment value (satoshis)
 * @property {number} remainingRetries Number of payment retry attempts remaining.
 * @property {number} maxRetries Maximum number of payment retries.
 * @property {'sending'|'successful'|'failed'} status Payment status.
 * @property {number} creationDate Creadtion date.
 * @property {boolean} isKeysend Boolean indicating if the payment is a keysend payment.
 * @property {boolean} isSending ForwardEvent.
 * @property {object} object Send payment error.
 */

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

/**
 * @typedef State
 * @property {boolean} paymentLoading Boolean indicating if payments are loading
 * @property {object[]} payments List of transactions
 * @property {PaymentSending[]} paymentsSending List of transactions in process of sending
 */

// ------------------------------------
// Initial State
// ------------------------------------

/** @type {State} */
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
 * @param {Array<object>} payments list of payments.
 * @returns {(dispatch:Function) => void} Thunk
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
 * @returns {(dispatch:Function, getState:Function) => void} Thunk
 */
const decPaymentRetry = paymentId => (dispatch, getState) => {
  const config = settingsSelectors.currentConfig(getState())
  dispatch({
    type: DECREASE_PAYMENT_RETRIES,
    paymentId,
    feeIncrementExponent: config.invoices.feeIncrementExponent,
  })
}

/**
 * sendPayment - After initiating a lightning payment, store details of it in paymentSending array.
 *
 * @param {object} data Payment data
 * @returns {(dispatch:Function) => void} Thunk
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

/**
 * paymentComplete - Completion handler for payInvoce.
 *
 * @param {string} paymentId Payment id (internal)
 * @returns {(dispatch:Function) => void} Thunk
 */
export const paymentComplete = paymentId => async dispatch => {
  const { payments } = await grpc.services.Lightning.listPayments({
    maxPayments: 3,
    indexOffset: 0,
    reversed: true,
  })
  payments && dispatch(receivePayments(payments))
  dispatch({ type: PAYMENT_COMPLETED, paymentId })
}

/**
 * paymentSuccessful - Success handler for payInvoice.
 *
 * @param {string} paymentId Payment id (internal)
 * @returns {(dispatch:Function, getState:Function) => Promise<void>} Thunk
 */
export const paymentSuccessful = paymentId => async (dispatch, getState) => {
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

  // Fetch updated channels.
  dispatch(fetchChannels())

  // Fetch new balance.
  dispatch(fetchBalance())
}

/**
 * paymentFailed - Error handler for payInvoice.
 *
 * @param {object} options Options
 * @param {string} options.paymentId Internal payment id
 * @param {object} options.error Error
 * @returns {(dispatch:Function, getState:Function) => Promise<void>} Thunk
 */
export const paymentFailed = ({ paymentId, error }) => async (dispatch, getState) => {
  const paymentSending = find(paymentsSending(getState()), { paymentId })
  const config = settingsSelectors.currentConfig(getState())

  // errors that trigger retry mechanism
  const RETRIABLE_ERRORS = [
    'payment attempt not completed before timeout', // ErrPaymentAttemptTimeout
    'unable to find a path to destination', // ErrNoPathFound
    'target not found', // ErrTargetNotInNetwork

    // SendPayment error codes.
    'FAILED_NO_ROUTE',
    'FAILED_ERROR',
    'FAILED_TIMEOUT',

    // SendPaymentV2 error codes.
    'FAILURE_REASON_NO_ROUTE',
    'FAILURE_REASON_ERROR',
    'FAILURE_REASON_TIMEOUT',

    // Internal codes.
    'TERMINATED_EARLY', // Triggered if sendPayment aborts without giveing a proper response.
  ]

  // If we found a related entery in paymentsSending, gracefully remove it and handle as error case.
  if (paymentSending) {
    const { creationDate, paymentRequest, remainingRetries, maxRetries } = paymentSending
    // if we have retries left and error is eligible for retry - rebroadcast payment
    if (paymentRequest && remainingRetries && RETRIABLE_ERRORS.includes(error.code)) {
      const data = {
        ...paymentSending,
        payReq: paymentRequest,
        originalPaymentId: paymentId,
      }
      const retryIndex = maxRetries - remainingRetries + 1
      // add increasing delay
      await delay(config.invoices.baseRetryDelay * retryIndex * retryIndex)
      dispatch(payInvoice(data)) // eslint-disable-line no-use-before-define
    } else {
      // Ensure payment stays in sending state for at least 2 seconds.
      await delay(2000 - (Date.now() - creationDate * 1000))

      // Mark the payment as failed.
      dispatch({ type: PAYMENT_FAILED, paymentId, error })
    }
  }
}

/**
 * payInvoice - Pay a lightning invoice.
 * Controller code that wraps the send action and schedules automatic retries in the case of a failure.
 *
 * @param {object} options Options
 * @param {string} options.payReq Payment request or node pubkey
 * @param {number} options.amt Payment amount (in sats)
 * @param {number} options.feeLimit The max fee to apply
 * @param {number} options.route Specific route to use.
 * @param {number} options.retries Number of remaining retries
 * @param {string} options.originalPaymentId Id of the original payment if (required if this is a payment retry)
 * @returns {(dispatch:Function, getState:Function) => Promise<void>} Thunk
 */
export const payInvoice = ({
  payReq,
  amt,
  feeLimit,
  route,
  retries = 0,
  originalPaymentId,
}) => async (dispatch, getState) => {
  const state = getState()
  const currentConfig = settingsSelectors.currentConfig(state)
  const routerSendPayment = infoSelectors.hasSendPaymentV2Support(state)
    ? grpc.services.Router.sendPaymentV2
    : grpc.services.Router.sendPayment
  const paymentId = originalPaymentId || genId()
  const isKeysend = isPubkey(payReq)
  let payload

  const paymentOptions = pick(currentConfig.payments, [
    'allowSelfPayment',
    'timeoutSeconds',
    'feeLimit',
    'maxParts',
  ])

  const defaultPaymentOptions = {
    allowSelfPayment: paymentOptions.allowSelfPayment,
    timeoutSeconds: paymentOptions.timeoutSeconds,
    feeLimitSat: paymentOptions.feeLimit,
    maxParts: paymentOptions.maxParts,
    paymentId,
  }

  // Prepare payload for lnd.
  if (isKeysend) {
    const options = prepareKeysendPayload(payReq, amt, feeLimit)
    payload = defaults(omitBy(options, isNil), defaultPaymentOptions)
  } else {
    const options = prepareBolt11Payload(payReq, amt, feeLimit)
    payload = defaults(omitBy(options, isNil), defaultPaymentOptions)
  }

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
    // Use Router service if lnd version supports it.
    if (infoSelectors.hasRouterSupport(getState())) {
      // If we have been supplied with exact route, attempt to use that route.
      if (route && route.isExact) {
        let result = {}
        try {
          const routeToUse = cloneDeep(route)
          delete routeToUse.isExact
          delete routeToUse.paymentHash

          // Add payment secret into the route.
          const paymentAddress = getTag(payReq, 'payment_secret')
          if (paymentAddress) {
            routeToUse.hops[routeToUse.hops.length - 1].tlvPayload = true
            routeToUse.hops[routeToUse.hops.length - 1].mppRecord = {
              paymentAddr: Buffer.from(paymentAddress, 'hex'),
              totalAmtMsat: routeToUse.totalAmtMsat - routeToUse.totalFeesMsat,
            }
          }

          result = await grpc.services.Router.sendToRouteV2({
            paymentHash: route.paymentHash ? Buffer.from(route.paymentHash, 'hex') : null,
            route: routeToUse,
          })

          if (result.failure) {
            throw new Error(result.failure.code)
          }
        } catch (error) {
          if (error.message === 'unknown service routerrpc.Router') {
            // We don't know for sure that the node has been compiled with the Router service.
            // Fall bak to using sendPayment in the event of an error.
            mainLog.warn('Unable to pay invoice using sendToRoute: %s', error.message)
            await routerSendPayment(payload)
          } else {
            throw error
          }
        }
      }

      // Otherwise, just use sendPayment.
      else {
        await routerSendPayment(payload)
      }
    }

    // For older versions use the legacy Lightning.sendPayment method.
    else {
      if (payload.feeLimitSat) {
        payload.feeLimit = { fixed: payload.feeLimitSat }
        delete payload.feeLimitSat
      }
      await grpc.services.Lightning.sendPayment(payload)
    }

    dispatch(paymentSuccessful(paymentId))
  } catch (error) {
    const userMessage = errorCodeToMessage(error.message)
    if (userMessage) {
      error.code = error.message
      error.message = userMessage
    }
    dispatch(paymentFailed({ paymentId, error }))
  }
}

/**
 * receiveHtlcEventData - Listener for when a new htlc event is pushed from the subscriber.
 *
 * @param {HtlcEvent} htlcEvent HtlcEvent
 * @returns {(dispatch:Function, getState:Function) => void} Thunk
 */
export const receiveHtlcEventData = htlcEvent => async (dispatch, getState) => {
  if (htlcEvent.eventType === 'SEND' && htlcEvent.settleEvent) {
    const isSending = find(paymentsSending(getState()), { status: PAYMENT_STATUS_SENDING })
    if (!isSending) {
      const { payments } = await grpc.services.Lightning.listPayments({
        maxPayments: 1,
        indexOffset: 0,
        reversed: true,
      })
      payments && dispatch(receivePayments(payments))
      dispatch(fetchChannels())
      dispatch(fetchBalance())
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
    state.payments = uniqBy(payments.concat(state.payments), 'paymentHash')
  },
  [SEND_PAYMENT]: (state, { payment }) => {
    state.paymentsSending.push(payment)
  },
  [DECREASE_PAYMENT_RETRIES]: (state, { paymentId, feeIncrementExponent }) => {
    const item = find(state.paymentsSending, { paymentId })
    if (item) {
      item.remainingRetries = Math.max(item.remainingRetries - 1, 0)
      if (item.feeLimit) {
        item.feeLimit = CoinBig(item.feeLimit)
          .times(feeIncrementExponent)
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
      item.isSending = false
      item.error = error
    }
  },
}

export default createReducer(initialState, ACTION_HANDLERS)
