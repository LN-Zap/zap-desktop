import delay from '@zap/utils/delay'
import { send } from 'redux-electron-ipc'
import { createSelector } from 'reselect'
import { initDb } from '@zap/renderer/store/db'
import { tickerSelectors } from './ticker'
import { setIsWalletOpen, walletSelectors } from './wallet'
import { stopLnd } from './lnd'

// ------------------------------------
// Initial State
// ------------------------------------
const initialState = {
  isLoading: true,
  isMounted: false,
  isRunning: false,
  isTerminating: false,
  isLoggingOut: false,
}

// ------------------------------------
// Constants
// ------------------------------------
export const SET_LOADING = 'SET_LOADING'
export const SET_MOUNTED = 'SET_MOUNTED'
export const INIT_DATABASE = 'INIT_DATABASE'
export const INIT_APP = 'INIT_APP'
export const LOGOUT = 'LOGOUT'
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'
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

export const logout = () => dispatch => {
  dispatch({ type: LOGOUT })
  dispatch(setIsWalletOpen(false))
  dispatch(stopLnd())
  dispatch(resetApp())
  dispatch({ type: LOGOUT_SUCCESS })
}

export const initDatabase = () => async dispatch => {
  dispatch({ type: INIT_DATABASE })
  await initDb()
}

/**
 * IPC handler for 'initApp' message
 */
export const initApp = () => async (dispatch, getState) => {
  dispatch({ type: INIT_APP })
  // add some delay if the app is starting for the first time vs logging out of the the opened wallet
  await delay(walletSelectors.isWalletOpen(getState()) ? 0 : 1500)
  dispatch(setLoading(false))
}

/**
 * IPC handler for 'terminateApp' message
 */
export const terminateApp = () => async dispatch => {
  dispatch({ type: TERMINATE_APP })
  await dispatch(stopLnd())
  dispatch({ type: TERMINATE_APP_SUCCESS })
  dispatch(send('terminateAppSuccess'))
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [INIT_APP]: state => ({ ...state, isRunning: true }),
  [SET_LOADING]: (state, { isLoading }) => ({ ...state, isLoading }),
  [SET_MOUNTED]: (state, { isMounted }) => ({ ...state, isMounted }),
  [LOGOUT]: state => ({ ...state, isLoggingOut: true }),
  [LOGOUT_SUCCESS]: state => ({ ...state, isLoggingOut: false }),
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
