import { createSelector } from 'reselect'
import { grpcService } from 'workers'

// ------------------------------------
// Constants
// ------------------------------------

export const FETCH_BALANCE = 'FETCH_BALANCE'
export const FETCH_BALANCE_SUCCESS = 'FETCH_BALANCE_SUCCESS'
export const FETCH_BALANCE_FAILURE = 'FETCH_BALANCE_FAILURE'

// ------------------------------------
// Actions
// ------------------------------------

// Fetch balances.
export const fetchBalance = () => async dispatch => {
  try {
    dispatch({ type: FETCH_BALANCE })
    const grpc = await grpcService
    const { walletBalance, channelBalance } = await grpc.services.Lightning.getBalance()
    dispatch({ type: FETCH_BALANCE_SUCCESS, walletBalance, channelBalance })
  } catch (error) {
    dispatch({ type: FETCH_BALANCE_FAILURE, error })
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------

const ACTION_HANDLERS = {
  [FETCH_BALANCE]: state => ({ ...state, isBalanceLoading: true }),
  [FETCH_BALANCE_SUCCESS]: (state, { walletBalance, channelBalance }) => ({
    ...state,
    isBalanceLoading: false,
    walletBalance: walletBalance.total_balance,
    walletBalanceConfirmed: walletBalance.confirmed_balance,
    walletBalanceUnconfirmed: walletBalance.unconfirmed_balance,
    channelBalance: channelBalance.balance + channelBalance.pending_open_balance,
    channelBalanceConfirmed: channelBalance.balance,
    channelBalancePending: channelBalance.pending_open_balance,
  }),
  [FETCH_BALANCE_FAILURE]: (state, { error }) => ({
    ...state,
    isBalanceLoading: false,
    fetchBalanceError: error,
  }),
}

// Selectors
const balanceSelectors = {}
balanceSelectors.channelBalance = state => state.balance.channelBalance
balanceSelectors.channelBalanceConfirmed = state => state.balance.channelBalanceConfirmed
balanceSelectors.channelBalancePending = state => state.balance.channelBalancePending
balanceSelectors.walletBalance = state => state.balance.walletBalance
balanceSelectors.walletBalanceConfirmed = state => state.balance.walletBalanceConfirmed
balanceSelectors.walletBalanceUnconfirmed = state => state.balance.walletBalanceUnconfirmed
balanceSelectors.limboBalance = state => state.channels.pendingChannels.total_limbo_balance

balanceSelectors.totalBalance = createSelector(
  balanceSelectors.channelBalance,
  balanceSelectors.walletBalance,
  balanceSelectors.limboBalance,
  (channelBalance = 0, walletBalance = 0, limboBalance = 0) =>
    channelBalance + walletBalance + limboBalance
)

export { balanceSelectors }

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  isBalanceLoading: false,
  walletBalance: null,
  walletBalanceConfirmed: null,
  walletBalanceUnconfirmed: null,
  channelBalance: null,
  fetchBalanceError: null,
}

export default function balanceReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
