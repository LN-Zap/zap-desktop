import delay from '@zap/utils/delay'
import { send } from 'redux-electron-ipc'
import { createSelector } from 'reselect'
import { tickerSelectors } from './ticker'
import { walletSelectors } from './wallet'
import { stopLnd } from './lnd'

// ------------------------------------
// Initial State
// ------------------------------------
const initialState = {
  isLoading: true,
  isMounted: false,
  isRunning: false,
  isTerminating: false,
}

// ------------------------------------
// Constants
// ------------------------------------
export const SET_LOADING = 'SET_LOADING'
export const SET_MOUNTED = 'SET_MOUNTED'
export const INIT_APP = 'INIT_APP'
export const RESET_APP = 'RESET_APP'
export const TERMINATE_APP = 'TERMINATE_APP'
export const TERMINATE_APP_SUCCESS = 'TERMINATE_APP_SUCCESS'

// ------------------------------------
// Actions
// ------------------------------------
//
export function setLoading(isLoading) {
  return {
    type: SET_LOADING,
    isLoading,
  }
}

export function setMounted(isMounted) {
  return {
    type: SET_MOUNTED,
    isMounted,
  }
}

export function resetApp() {
  return {
    type: RESET_APP,
  }
}

export const initApp = () => async (dispatch, getState) => {
  dispatch({ type: INIT_APP })
  // add some delay if the app is starting for the first time vs logging out of the the opened wallet
  await delay(walletSelectors.isWalletOpen(getState()) ? 0 : 1500)
  dispatch(setLoading(false))
}

/**
 * IPC handler for 'terminateApp' message
 */
export const terminateApp = (event, handler) => async dispatch => {
  dispatch({ type: TERMINATE_APP })

  // Shutdown lnd before terminating.
  await dispatch(stopLnd())

  dispatch(terminateAppSuccess(handler))
}

export const terminateAppSuccess = handler => async dispatch => {
  dispatch({ type: TERMINATE_APP_SUCCESS })
  dispatch(send(handler))
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [INIT_APP]: state => ({ ...state, isRunning: true }),
  [SET_LOADING]: (state, { isLoading }) => ({ ...state, isLoading }),
  [SET_MOUNTED]: (state, { isMounted }) => ({ ...state, isMounted }),
  [TERMINATE_APP]: state => ({ ...state, isTerminating: true }),
  [TERMINATE_APP_SUCCESS]: state => ({ ...state, isTerminating: false, isRunning: false }),
}

// ------------------------------------
// Selectors
// ------------------------------------

const appSelectors = {}
appSelectors.isLoading = state => state.app.isLoading
appSelectors.isMounted = state => state.app.isMounted
appSelectors.currency = state => state.ticker.currency
appSelectors.infoLoaded = state => state.info.infoLoaded
appSelectors.isRunning = state => state.app.isRunning
appSelectors.isWalletsLoaded = state => state.wallet.isWalletsLoaded
appSelectors.walletBalance = state => state.balance.walletBalance
appSelectors.channelBalance = state => state.balance.channelBalance

appSelectors.isRootReady = createSelector(
  appSelectors.isRunning,
  appSelectors.isWalletsLoaded,
  (onboarding, isWalletsLoaded) => {
    return Boolean(onboarding && isWalletsLoaded)
  }
)

appSelectors.isAppReady = createSelector(
  appSelectors.infoLoaded,
  tickerSelectors.currency,
  tickerSelectors.currentTicker,
  appSelectors.walletBalance,
  appSelectors.channelBalance,
  (infoLoaded, currency, currentTicker, walletBalance, channelBalance) => {
    return Boolean(
      infoLoaded && currency && currentTicker && channelBalance !== null && walletBalance !== null
    )
  }
)

export { appSelectors }

// ------------------------------------
// Reducer
// ------------------------------------
export default function loadingReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
