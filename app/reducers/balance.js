import { createSelector } from 'reselect'
import { send } from 'redux-electron-ipc'

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

// Send IPC event for balance
export const fetchBalance = () => async dispatch => {
  dispatch(getBalance())
  dispatch(send('lnd', { msg: 'balance' }))
}

// Receive IPC event for balance
export const receiveBalance = (event, { walletBalance, channelBalance }) => dispatch => {
  dispatch({ type: RECEIVE_BALANCE, walletBalance, channelBalance })
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [GET_BALANCE]: state => ({ ...state, balanceLoading: true }),
  [RECEIVE_BALANCE]: (state, { walletBalance, channelBalance }) => ({
    ...state,
    balanceLoading: false,
    walletBalance,
    channelBalance
  })
}

const channelBalanceSelector = state => state.balance.channelBalance
const walletBalanceSelector = state => state.balance.walletBalance

// Selectors
const balanceSelectors = {}

balanceSelectors.totalBalance = createSelector(
  channelBalanceSelector,
  walletBalanceSelector,
  (channelBalance, walletBalance) => (channelBalance || 0) + (walletBalance || 0)
)

export { balanceSelectors }

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
