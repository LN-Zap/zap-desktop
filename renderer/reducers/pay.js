import get from 'lodash/get'
import { grpcService } from 'workers'
import { estimateFeeRange } from '@zap/utils/fee'
import { settingsSelectors } from './settings'

// ------------------------------------
// Initial State
// ------------------------------------
const initialState = {
  isQueryingRoutes: false,
  isQueryingFees: false,
  onchainFees: {
    fast: null,
    medium: null,
    slow: null,
  },
  pubKey: null,
  queryFeesError: null,
  queryRoutesError: null,
  redirectPayReq: null,
  routes: [],
}

// ------------------------------------
// Constants
// ------------------------------------
export const QUERY_FEES = 'QUERY_FEES'
export const QUERY_FEES_SUCCESS = 'QUERY_FEES_SUCCESS'
export const QUERY_FEES_FAILURE = 'QUERY_FEES_FAILURE'

export const QUERY_ROUTES = 'QUERY_ROUTES'
export const QUERY_ROUTES_SUCCESS = 'QUERY_ROUTES_SUCCESS'
export const QUERY_ROUTES_FAILURE = 'QUERY_ROUTES_FAILURE'

export const SET_REDIRECT_PAY_REQ = 'SET_REDIRECT_PAY_REQ'

// ------------------------------------
// IPC
// ------------------------------------

/**
 * lightningPaymentUri - Initiate lightning payment flow.
 *
 * @param  {event} event Event
 * @param  {{ address }} address Address (payment request)
 * @returns {Function} Thunk
 */
export const lightningPaymentUri = (event, { address }) => dispatch => {
  dispatch(setRedirectPayReq({ address }))
}

/**
 * bitcoinPaymentUri - Initiate bitcoin payment flow.
 *
 * @param  {event} event Event
 * @param  {{ address, options }} options Decoded bip21 payment url
 * @returns {Function} Thunk
 */
export const bitcoinPaymentUri = (event, { address, options: { amount } }) => dispatch => {
  dispatch(setRedirectPayReq({ address, amount }))
}

// ------------------------------------
// Actions
// ------------------------------------

/**
 * queryFees - Estimates on-chain fee.
 *
 * @param {string} address Destination address
 * @param {number} amountInSats desired amount in satoshis
 * @returns {Function} Thunk
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
    const error = get(e, 'response.statusText', e)
    dispatch({ type: QUERY_FEES_FAILURE, error })
  }
}

/**
 * queryRoutes - Find valid routes to make a payment to a node.
 *
 * @param {string} pubKey Destination node pubkey
 * @param {number} amount Desired amount in satoshis
 * @returns {Function} Thunk
 */
export const queryRoutes = (pubKey, amount) => async dispatch => {
  dispatch({ type: QUERY_ROUTES, pubKey })
  try {
    const grpc = await grpcService
    const routes = await grpc.services.Lightning.queryRoutes({ pub_key: pubKey, amt: amount })
    dispatch({ type: QUERY_ROUTES_SUCCESS, routes })
  } catch (e) {
    dispatch({ type: QUERY_ROUTES_FAILURE })
  }
}

/**
 * setRedirectPayReq - Set payment request to initiate payment flow to a specific address / payment request.
 *
 * @param {{address, amount}} redirectPayReq Payment request details
 * @returns {object} Action
 */
export function setRedirectPayReq(redirectPayReq) {
  return {
    type: SET_REDIRECT_PAY_REQ,
    redirectPayReq,
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------

const ACTION_HANDLERS = {
  [QUERY_FEES]: state => ({
    ...state,
    isQueryingFees: true,
    onchainFees: {},
    queryFeesError: null,
  }),
  [QUERY_FEES_SUCCESS]: (state, { onchainFees }) => ({
    ...state,
    isQueryingFees: false,
    onchainFees,
    queryFeesError: null,
  }),
  [QUERY_FEES_FAILURE]: (state, { error }) => ({
    ...state,
    isQueryingFees: false,
    onchainFees: {},
    queryFeesError: error,
  }),
  [QUERY_ROUTES]: (state, { pubKey }) => ({
    ...state,
    isQueryingRoutes: true,
    pubKey,
    queryRoutesError: null,
    routes: [],
  }),
  [QUERY_ROUTES_SUCCESS]: (state, { routes }) => ({
    ...state,
    isQueryingRoutes: false,
    queryRoutesError: null,
    routes,
  }),
  [QUERY_ROUTES_FAILURE]: (state, { error }) => ({
    ...state,
    isQueryingRoutes: false,
    pubKey: null,
    queryRoutesError: error,
    routes: [],
  }),
  [SET_REDIRECT_PAY_REQ]: (state, { redirectPayReq }) => ({
    ...state,
    redirectPayReq,
  }),
}

// ------------------------------------
// Reducer
// ------------------------------------

/**
 * payReducer - Pay reducer.
 *
 * @param  {object} state = initialState Initial state
 * @param  {object} action Action
 * @returns {object} Next state
 */
export default function payReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
