import defaults from 'lodash/defaults'
import get from 'lodash/get'
import isNil from 'lodash/isNil'
import omitBy from 'lodash/omitBy'
import pick from 'lodash/pick'

import createReducer from '@zap/utils/createReducer'
import { isPubkey, getTag } from '@zap/utils/crypto'
import { estimateFeeRange } from '@zap/utils/fee'
import { infoSelectors } from 'reducers/info'
import { prepareKeysendProbe, prepareBolt11Probe } from 'reducers/payment'
import { settingsSelectors } from 'reducers/settings'
import { grpc } from 'workers'

import * as constants from './constants'

const {
  QUERY_FEES,
  QUERY_FEES_SUCCESS,
  QUERY_FEES_FAILURE,
  QUERY_ROUTES,
  QUERY_ROUTES_SUCCESS,
  QUERY_ROUTES_FAILURE,
  SET_REDIRECT_PAY_REQ,
} = constants

/**
 * @typedef State
 * @property {boolean} isQueryingRoutes Boolean indicating if routes are being probed
 * @property {boolean} isQueryingFees Boolean indicating if fees are being queried
 * @property {{fast:string|null, medium:string|null, slow:string|null}} onchainFees Onchain fee rates
 * @property {string|null} queryFeesError Query fees error message
 * @property {string|null} queryRoutesError Query routes error message
 * @property {string|null} redirectPayReq Payrequest injected from external source
 * @property {object[]} routes Routes from last probe attempt
 */

// ------------------------------------
// Initial State
// ------------------------------------

/** @type {State} */
const initialState = {
  isQueryingRoutes: false,
  isQueryingFees: false,
  onchainFees: {
    fast: null,
    medium: null,
    slow: null,
  },
  queryFeesError: null,
  queryRoutesError: null,
  redirectPayReq: null,
  routes: [],
}

// ------------------------------------
// Actions
// ------------------------------------

/**
 * setRedirectPayReq - Set payment request to initiate payment flow to a specific address / payment request.
 *
 * @param {{address:string, amount:string}} redirectPayReq Payment request details
 * @returns {object} Action
 */
export function setRedirectPayReq(redirectPayReq) {
  return {
    type: SET_REDIRECT_PAY_REQ,
    redirectPayReq,
  }
}

/**
 * queryFees - Estimates on-chain fee.
 *
 * @param {string} address Destination address
 * @param {number} amountInSats desired amount in satoshis
 * @returns {(dispatch:Function, getState:Function) => Promise<void>} Thunk
 */
export const queryFees = (address, amountInSats) => async (dispatch, getState) => {
  dispatch({ type: QUERY_FEES })
  try {
    const onchainFees = await estimateFeeRange({
      address,
      amountInSats,
      range: settingsSelectors.currentConfig(getState()).lndTargetConfirmations,
    })

    dispatch({ type: QUERY_FEES_SUCCESS, onchainFees })
  } catch (e) {
    const error = get(e, 'response.statusText', e.message)
    dispatch({ type: QUERY_FEES_FAILURE, error })
  }
}

/**
 * queryRoutes - Find valid routes to make a payment to a node.
 *
 * @param {string} payReqOrPubkey Payment request or node pubkey
 * @param {number} amt Payment amount (in sats)
 * @param {number} feeLimit The max fee to apply
 * @returns {(dispatch:Function, getState:Function) => Promise<void>} Thunk
 */
export const queryRoutes = (payReqOrPubkey, amt, feeLimit) => async (dispatch, getState) => {
  const currentConfig = settingsSelectors.currentConfig(getState())
  const isKeysend = isPubkey(payReqOrPubkey)
  let paymentHash
  let payload

  const paymentOptions = pick(currentConfig.payments, [
    'allowSelfPayment',
    'timeoutSeconds',
    'feeLimit',
  ])

  const defaultPaymentOptions = {
    allowSelfPayment: paymentOptions.allowSelfPayment,
    timeoutSeconds: paymentOptions.timeoutSeconds,
    feeLimitSat: paymentOptions.feeLimit,
  }

  // Prepare payload for lnd.
  if (isKeysend) {
    const options = prepareKeysendProbe(payReqOrPubkey, amt, feeLimit)
    payload = defaults(omitBy(options, isNil), defaultPaymentOptions)
    paymentHash = payload.paymentHash // eslint-disable-line prefer-destructuring
  } else {
    const options = prepareBolt11Probe(payReqOrPubkey, feeLimit)
    payload = defaults(omitBy(options, isNil), defaultPaymentOptions)
    paymentHash = getTag(payReqOrPubkey, 'payment_hash')
  }

  const callQueryRoutes = async () => {
    const { routes } = await grpc.services.Lightning.queryRoutes({
      ...payload,
      useMissionControl: true,
    })
    return routes
  }

  const callProbePayment = async () => {
    const routerProbePayment = infoSelectors.hasSendPaymentV2Support(getState())
      ? grpc.services.Router.probePaymentV2
      : grpc.services.Router.probePayment

    const routes = []
    const route = await routerProbePayment(payload)
    // Flag this as an exact route. This can be used as a hint for whether to use sendToRoute to fulfil the payment.
    route.isExact = true
    // Store the payment hash for use with keysend.
    route.paymentHash = paymentHash
    routes.push(route)
    return routes
  }

  dispatch({ type: QUERY_ROUTES, paymentHash })

  try {
    let routes = []

    // Try to use payment probing if lnd version supports the Router service.
    if (infoSelectors.hasRouterSupport(getState())) {
      try {
        routes = await callProbePayment()
      } catch (error) {
        // If the probe didn't find a route trigger a failure.
        if (['FAILED_TIMEOUT', 'FAILED_NO_ROUTE', 'FAILED_ERROR'].includes(error.message)) {
          throw error
        }

        // There is no guarentee that the lnd node has the Router service enabled.
        // Fall back to using queryRoutes if we got some other type of error.
        routes = await callQueryRoutes()
      }
    }

    // For older versions use queryRoutes.
    else {
      routes = await callQueryRoutes()
    }

    dispatch({ type: QUERY_ROUTES_SUCCESS, routes })
  } catch (e) {
    dispatch({ type: QUERY_ROUTES_FAILURE, error: e.message })
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------

const ACTION_HANDLERS = {
  [QUERY_FEES]: state => {
    state.isQueryingFees = true
    state.onchainFees = {}
    state.queryFeesError = null
  },
  [QUERY_FEES_SUCCESS]: (state, { onchainFees }) => {
    state.isQueryingFees = false
    state.onchainFees = onchainFees
    state.queryFeesError = null
  },
  [QUERY_FEES_FAILURE]: (state, { error }) => {
    state.isQueryingFees = false
    state.onchainFees = {}
    state.queryFeesError = error
  },
  [QUERY_ROUTES]: state => {
    state.isQueryingRoutes = true
    state.queryRoutesError = null
    state.routes = []
  },
  [QUERY_ROUTES_SUCCESS]: (state, { routes }) => {
    state.isQueryingRoutes = false
    state.queryRoutesError = null
    state.routes = routes
  },
  [QUERY_ROUTES_FAILURE]: (state, { error }) => {
    state.isQueryingRoutes = false
    state.queryRoutesError = error
    state.routes = []
  },
  [SET_REDIRECT_PAY_REQ]: (state, { redirectPayReq }) => {
    state.redirectPayReq = redirectPayReq
  },
}

export default createReducer(initialState, ACTION_HANDLERS)
