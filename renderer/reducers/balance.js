import { createSelector } from 'reselect'
import { grpcService } from 'workers'
import createReducer from './utils/createReducer'

// ------------------------------------
// Initial State
// ------------------------------------

const initialState = {
  isBalanceLoading: false,
  walletBalance: null,
  walletBalanceConfirmed: null,
  walletBalanceUnconfirmed: null,
  channelBalance: null,
  fetchBalanceError: null,
}

// ------------------------------------
// Constants
// ------------------------------------

export const FETCH_BALANCE = 'FETCH_BALANCE'
export const FETCH_BALANCE_SUCCESS = 'FETCH_BALANCE_SUCCESS'
export const FETCH_BALANCE_FAILURE = 'FETCH_BALANCE_FAILURE'

// ------------------------------------
// Actions
// ------------------------------------

/**
 * fetchBalance - Fetch balances.
 *
 * @returns {Function} Thunk
 */
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
  [FETCH_BALANCE]: state => {
    state.isBalanceLoading = true
  },
  [FETCH_BALANCE_SUCCESS]: (state, { walletBalance, channelBalance }) => {
    state.isBalanceLoading = false
    state.walletBalance = walletBalance.total_balance
    state.walletBalanceConfirmed = walletBalance.confirmed_balance
    state.walletBalanceUnconfirmed = walletBalance.unconfirmed_balance
    state.channelBalance = channelBalance.balance + channelBalance.pending_open_balance
    state.channelBalanceConfirmed = channelBalance.balance
    state.channelBalancePending = channelBalance.pending_open_balance
  },
  [FETCH_BALANCE_FAILURE]: (state, { error }) => {
    state.isBalanceLoading = false
    state.fetchBalanceError = error
  },
}

// ------------------------------------
// Selectors
// ------------------------------------

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

export default createReducer(initialState, ACTION_HANDLERS)
