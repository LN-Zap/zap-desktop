import { callApis } from '../api'
// ------------------------------------
// Constants
// ------------------------------------
export const GET_BALANCE = 'GET_BALANCE'
export const RECEIVE_BALANCE = 'RECEIVE_BALANCE'

// ------------------------------------
// Actions
// ------------------------------------
export function getBalance() {
  return {
    type: GET_BALANCE
  }
}

export function receiveBalance(data) {
  return {
    type: RECEIVE_BALANCE,
    walletBalance: data[0].data.balance,
    channelBalance: data[1].data.balance
  }
}

export const fetchBalance = () => async (dispatch) => {
  dispatch(getBalance())
  const balance = await callApis(['wallet_balance', 'channel_balance'])
  dispatch(receiveBalance(balance))
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [GET_BALANCE]: (state) => ({ ...state, balanceLoading: true }),
  [RECEIVE_BALANCE]: (state, { walletBalance, channelBalance }) => ({ ...state, balanceLoading: false, walletBalance, channelBalance })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  balanceLoading: false,
  walletBalance: null,
  channelBalance: null
}

export default function balanceReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}