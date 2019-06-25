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
// Actions
// ------------------------------------

/**
 * Estimates on-chain fee
 *
 * @param {string} [address]
 * @param {number} [amountInSats] desired amount in satoshis
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

export const queryRoutes = (pubKey, amount) => async dispatch => {
  dispatch({ type: QUERY_ROUTES, pubKey })
  try {
    const grpc = await grpcService
    const routes = await grpc.services.Lightning.queryRoutes({ pub_key: pubKey, amt: amount })
    dispatch(queryRoutesSuccess(routes))
  } catch (e) {
    dispatch(queryRoutesFailure())
  }
}

export const queryRoutesSuccess = ({ routes }) => dispatch =>
  dispatch({ type: QUERY_ROUTES_SUCCESS, routes })

export const queryRoutesFailure = () => dispatch => {
  dispatch({ type: QUERY_ROUTES_FAILURE })
}

export function setRedirectPayReq(redirectPayReq) {
  return {
    type: SET_REDIRECT_PAY_REQ,
    redirectPayReq,
  }
}

export const bitcoinPaymentUri = (event, { address, options: { amount } }) => dispatch => {
  dispatch(setRedirectPayReq({ address, amount }))
}

export const lightningPaymentUri = (event, { address }) => dispatch => {
  dispatch(setRedirectPayReq({ address }))
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
 * @returns {object} Final state
 */
export default function payReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
