import Coin from '@zap/utils/coin'
import { grpc } from 'workers'
import createReducer from '@zap/utils/createReducer'
import * as constants from './constants'

const { FETCH_BALANCE, FETCH_BALANCE_SUCCESS, FETCH_BALANCE_FAILURE } = constants

// ------------------------------------
// Initial State
// ------------------------------------

const initialState = {
  isBalanceLoading: false,
  walletBalance: null,
  walletBalanceConfirmed: null,
  walletBalanceUnconfirmed: null,
  channelBalance: null,
  channelBalanceConfirmed: null,
  channelBalancePending: null,
  fetchBalanceError: null,
}

// ------------------------------------
// Actions
// ------------------------------------

/**
 * fetchBalance - Fetch balances.
 *
 * @returns {(dispatch:Function) => Promise<void>} Thunk
 */
export const fetchBalance = () => async dispatch => {
  try {
    dispatch({ type: FETCH_BALANCE })
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
    state.walletBalance = walletBalance.totalBalance
    state.walletBalanceConfirmed = walletBalance.confirmedBalance
    state.walletBalanceUnconfirmed = walletBalance.unconfirmedBalance
    state.channelBalance = Coin(channelBalance.balance)
      .add(Coin(channelBalance.pendingOpenBalance))
      .toString()
    state.channelBalanceConfirmed = channelBalance.balance
    state.channelBalancePending = channelBalance.pendingOpenBalance
  },
  [FETCH_BALANCE_FAILURE]: (state, { error }) => {
    state.isBalanceLoading = false
    state.fetchBalanceError = error
  },
}

export default createReducer(initialState, ACTION_HANDLERS)
