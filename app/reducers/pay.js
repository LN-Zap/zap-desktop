import { ipcRenderer } from 'electron'
import get from 'lodash.get'
import { requestFees } from 'lib/utils/api'
import { setFormType } from './form'

// ------------------------------------
// Constants
// ------------------------------------
export const QUERY_FEES = 'QUERY_FEES'
export const QUERY_FEES_SUCCESS = 'QUERY_FEES_SUCCESS'
export const QUERY_FEES_FAILURE = 'QUERY_FEES_FAILURE'

export const QUERY_ROUTES = 'QUERY_ROUTES'
export const QUERY_ROUTES_SUCCESS = 'QUERY_ROUTES_SUCCESS'
export const QUERY_ROUTES_FAILURE = 'QUERY_ROUTES_FAILURE'

export const SET_PAY_REQ = 'SET_PAY_REQ'

// ------------------------------------
// Actions
// ------------------------------------
export const queryFees = () => async dispatch => {
  dispatch({ type: QUERY_FEES })
  try {
    const onchainFees = await requestFees()
    dispatch({ type: QUERY_FEES_SUCCESS, onchainFees })
  } catch (e) {
    const error = get(e, 'response.statusText', e)
    dispatch({ type: QUERY_FEES_FAILURE, error })
  }
}

export const queryRoutes = (pubKey, amount) => dispatch => {
  dispatch({ type: QUERY_ROUTES, pubKey })
  ipcRenderer.send('lnd', { msg: 'queryRoutes', data: { pubkey: pubKey, amount } })
}

export const queryRoutesSuccess = (event, { routes }) => dispatch =>
  dispatch({ type: QUERY_ROUTES_SUCCESS, routes })

export const queryRoutesFailure = () => dispatch => {
  dispatch({ type: QUERY_ROUTES_FAILURE })
}

export function setPayReq(payReq) {
  return {
    type: SET_PAY_REQ,
    payReq
  }
}

export const lightningPaymentUri = (event, { payReq }) => dispatch => {
  // First, clear the payment form.
  dispatch(setFormType(null))

  // Then load it fresh and set the payment request.
  dispatch(setFormType('PAY_FORM'))
  dispatch(setPayReq(payReq))

  // Finally, clear the payment request.
  dispatch(setPayReq(null))
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [QUERY_FEES]: state => ({
    ...state,
    isQueryingFees: true,
    onchainFees: {},
    queryFeesError: null
  }),
  [QUERY_FEES_SUCCESS]: (state, { onchainFees }) => ({
    ...state,
    isQueryingFees: false,
    onchainFees,
    queryFeesError: null
  }),
  [QUERY_FEES_FAILURE]: (state, { error }) => ({
    ...state,
    isQueryingFees: false,
    onchainFees: {},
    queryFeesError: error
  }),
  [QUERY_ROUTES]: (state, { pubKey }) => ({
    ...state,
    isQueryingRoutes: true,
    pubKey,
    queryRoutesError: null,
    routes: []
  }),
  [QUERY_ROUTES_SUCCESS]: (state, { routes }) => ({
    ...state,
    isQueryingRoutes: false,
    queryRoutesError: null,
    routes
  }),
  [QUERY_ROUTES_FAILURE]: (state, { error }) => ({
    ...state,
    isQueryingRoutes: false,
    pubKey: null,
    queryRoutesError: error,
    routes: []
  }),
  [SET_PAY_REQ]: (state, { payReq }) => ({
    ...state,
    payReq
  })
}

// ------------------------------------
// Initial State
// ------------------------------------
const initialState = {
  isQueryingRoutes: false,
  isQueryingFees: false,
  onchainFees: {
    fastestFee: null,
    halfHourFee: null,
    hourFee: null
  },
  payReq: null,
  pubKey: null,
  queryFeesError: null,
  queryRoutesError: null,
  routes: []
}

// ------------------------------------
// Reducer
// ------------------------------------
export default function activityReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
