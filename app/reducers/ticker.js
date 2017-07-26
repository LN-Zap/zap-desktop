import { requestTicker } from '../api'
// ------------------------------------
// Constants
// ------------------------------------
export const GET_TICKER = 'GET_TICKER'
export const RECIEVE_TICKER = 'RECIEVE_TICKER'

// ------------------------------------
// Actions
// ------------------------------------
export function getTicker() {
  return {
    type: GET_TICKER
  }
}

export function recieveTicker(ticker) {
  return {
    type: RECIEVE_TICKER,
    ticker
  }
}

export const fetchTicker = () => async (dispatch) => {
  dispatch(getTicker())
  const ticker = await requestTicker()
  dispatch(recieveTicker(ticker))

  return ticker
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [GET_TICKER]: (state) => ({ ...state, tickerLoading: true }),
  [RECIEVE_TICKER]: (state, { ticker }) => ({...state, btcTicker: ticker[0] })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  tickerLoading: false,
  current: 'btc',
  crypto: 'btc',
  btcTicker: null
}

export default function tickerReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}