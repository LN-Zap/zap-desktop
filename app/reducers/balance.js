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
    walletBalance: walletBalance.total_balance,
    walletBalanceConfirmed: walletBalance.confirmed_balance,
    walletBalanceUnconfirmed: walletBalance.unconfirmed_balance,
    channelBalance
  })
}

// Selectors
const balanceSelectors = {}
balanceSelectors.channelBalance = state => state.balance.channelBalance
balanceSelectors.walletBalance = state => state.balance.walletBalance
balanceSelectors.walletBalanceConfirmed = state => state.balance.walletBalanceConfirmed
balanceSelectors.walletBalanceUnconfirmed = state => state.balance.walletBalanceUnconfirmed

balanceSelectors.totalBalance = createSelector(
  balanceSelectors.channelBalance,
  balanceSelectors.walletBalance,
  (channelBalance, walletBalance) => (channelBalance || 0) + (walletBalance || 0)
)

export { balanceSelectors }

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  balanceLoading: false,
  walletBalance: null,
  walletBalanceConfirmed: null,
  walletBalanceUnconfirmed: null,
  channelBalance: null
}

export default function balanceReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
