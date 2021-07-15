import Coin from '@zap/utils/coin'
import createReducer from '@zap/utils/createReducer'
import { grpc } from 'workers'

import * as constants from './constants'

const { FETCH_BALANCE, FETCH_BALANCE_SUCCESS, FETCH_BALANCE_FAILURE } = constants

// ------------------------------------
// Initial State
// ------------------------------------

/**
 * @typedef State
 * @property {boolean} isBalanceLoading Boolean indicating if balances are loading.
 * @property {string|null} walletBalance Total wallet balance.
 * @property {string|null} walletBalanceConfirmed Confirmed wallet balance.
 * @property {string|null} walletBalanceUnconfirmed Unconfirmed wallet balance.
 * @property {string|null} channelBalance Total channel balance.
 * @property {string|null} channelBalanceConfirmed Confirmed channel balance.
 * @property {string|null} channelBalancePending Pending channel balance.
 * @property {Error|null} fetchBalanceError Balance fetching error.
 */

/** @type {State} */
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
