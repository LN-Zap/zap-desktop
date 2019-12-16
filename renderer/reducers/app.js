import { send } from 'redux-electron-ipc'
import { createSelector } from 'reselect'
import createReducer from '@zap/utils/createReducer'
import delay from '@zap/utils/delay'
import { initDb } from '@zap/renderer/store/db'
import { getIntl } from '@zap/i18n'
import { showError } from 'reducers/notification'
import { initCurrency, tickerSelectors } from './ticker'
import { initWallets, setIsWalletOpen, walletSelectors } from './wallet'
import { initTheme, setTheme, themeSelectors } from './theme'
import { resetActivity } from './activity'
import { initAccount } from 'reducers/account'
import { initLocale } from 'reducers/locale'
import { initNeutrino } from 'reducers/neutrino'
import { initAutopay } from 'reducers/autopay'
import { initChannels } from 'reducers/channels'
import { stopLnd } from './lnd'
import { openModal } from './modal'
import messages from './messages'

// ------------------------------------
// Initial State
// ------------------------------------

const initialState = {
  isLoading: true,
  isMounted: false,
  isRunning: false,
  isDatabaseReady: false,
  isSettingsLoaded: false,
  isTerminating: false,
  isLoggingOut: false,
  initDatabaseError: null,
}

// ------------------------------------
// Constants
// ------------------------------------

export const SET_LOADING = 'SET_LOADING'
export const SET_MOUNTED = 'SET_MOUNTED'
export const INIT_DATABASE = 'INIT_DATABASE'
export const INIT_DATABASE_SUCCESS = 'INIT_DATABASE_SUCCESS'
export const INIT_DATABASE_FAILURE = 'INIT_DATABASE_FAILURE'
export const INIT_APP = 'INIT_APP'
export const LOGOUT = 'LOGOUT'
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'
export const RESET_APP = 'RESET_APP'
export const TERMINATE_APP = 'TERMINATE_APP'
export const TERMINATE_APP_SUCCESS = 'TERMINATE_APP_SUCCESS'

// ------------------------------------
// Actions
// ------------------------------------

/**
 * setLoading - Set app loading state.
 *
 * @param {boolean} isLoading Boolean indicating whether the app is loading
 * @returns {object} Action
 */
export function setLoading(isLoading) {
  return {
    type: SET_LOADING,
    isLoading,
  }
}

/**
 * setLoading - Set app mount state.
 *
 * @param {boolean} isMounted Boolean indicating whether the app has been mounted
 * @returns {object} Action
 */
export function setMounted(isMounted) {
  return {
    type: SET_MOUNTED,
    isMounted,
  }
}

/**
 * resetApp - Reset app state.
 *
 * @returns {object} Action
 */
export function resetApp() {
  return {
    type: RESET_APP,
  }
}

/**
 * logout - Perform wallet logout.
 *
 * @returns {Function} Thunk
 */
export const logout = () => dispatch => {
  dispatch({ type: LOGOUT })
  dispatch(setIsWalletOpen(false))
  dispatch(stopLnd())
  dispatch(resetApp())
  dispatch(resetActivity())
  dispatch({ type: LOGOUT_SUCCESS })
}

/**
 * initDatabase - Initialize app database.
 *
 * @param {string} key Database encryption key
 * @returns {Function} Thunk
 */
export const initDatabase = key => async dispatch => {
  dispatch({ type: INIT_DATABASE })
  try {
    window.db = await initDb({ newKey: key })
    dispatch({ type: INIT_DATABASE_SUCCESS })
  } catch (e) {
    dispatch({ type: INIT_DATABASE_FAILURE, error: e.message })
    dispatch(
      showError(getIntl().formatMessage(messages.app_init_db_error, { error: e.message }), {
        timeout: 0,
      })
    )
  }
}

/**
 * initRoot - Initialize app root.
 *
 * @returns {Function} Thunk
 */
export const initRoot = () => async dispatch => {
  dispatch(initTheme())
  dispatch(initAccount())
  dispatch(initNeutrino())
  dispatch(initLocale())
  dispatch(initCurrency())
  dispatch(initAutopay())
  dispatch(initWallets())
  dispatch(initChannels())
}

// ------------------------------------
// IPC
// ------------------------------------

/**
 * initApp - IPC handler for 'initApp' message.
 *
 * @param {object} event Event
 * @param {object} options Options
 * @returns {Function} Thunk
 */
export const initApp = (event, options = {}) => async (dispatch, getState) => {
  dispatch({ type: INIT_APP, options })

  // Set the theme from incoming init options if the theme is not already set.
  if (options.theme) {
    !themeSelectors.currentTheme(getState()) && dispatch(setTheme(options.theme))
  }
  // add some delay if the app is starting for the first time vs logging out of the the opened wallet
  await delay(walletSelectors.isWalletOpen(getState()) ? 0 : 1500)
  dispatch(setLoading(false))
}

/**
 * terminateApp - IPC handler for 'terminateApp' message.
 *
 * @returns {Function} Thunk
 */
export const terminateApp = () => async dispatch => {
  try {
    dispatch({ type: TERMINATE_APP })
    await dispatch(stopLnd())
    dispatch({ type: TERMINATE_APP_SUCCESS })
    dispatch(send('terminateAppSuccess'))
  } catch (e) {
    dispatch(send('terminateAppFailed', e))
  }
}

/**
 * openPreferences - IPC handler for 'openPreferences' message.
 *
 * @returns {Function} Thunk
 */
export const openPreferences = () => dispatch => {
  dispatch(openModal('SETTINGS'))
}

// ------------------------------------
// Action Handlers
// ------------------------------------

const ACTION_HANDLERS = {
  [INIT_APP]: state => {
    state.isRunning = true
  },
  [INIT_DATABASE]: () => {}, // no state change
  [INIT_DATABASE_SUCCESS]: state => {
    state.isDatabaseReady = true
  },
  [INIT_DATABASE_FAILURE]: (state, { error }) => {
    state.initDatabaseError = error
  },
  [SET_LOADING]: (state, { isLoading }) => {
    state.isLoading = isLoading
  },
  [SET_MOUNTED]: (state, { isMounted }) => {
    state.isMounted = isMounted
  },
  [LOGOUT]: state => {
    state.isLoggingOut = true
  },
  [LOGOUT_SUCCESS]: state => {
    state.isLoggingOut = false
  },
  [TERMINATE_APP]: state => {
    state.isTerminating = true
  },
  [TERMINATE_APP_SUCCESS]: state => {
    state.isTerminating = false
    state.isRunning = false
  },
}

// ------------------------------------
// Selectors
// ------------------------------------

const appSelectors = {}
appSelectors.isLoading = state => state.app.isLoading
appSelectors.isMounted = state => state.app.isMounted
appSelectors.isDatabaseReady = state => state.app.isDatabaseReady
appSelectors.isSettingsLoaded = state => state.settings.isSettingsLoaded
appSelectors.currency = state => tickerSelectors.cryptoUnit(state)
appSelectors.infoLoaded = state => state.info.infoLoaded
appSelectors.isRunning = state => state.app.isRunning
appSelectors.walletBalance = state => state.balance.walletBalance
appSelectors.channelBalance = state => state.balance.channelBalance

appSelectors.isRootReady = createSelector(
  appSelectors.isRunning,
  appSelectors.isDatabaseReady,
  appSelectors.isSettingsLoaded,
  (isRunning, isDatabaseReady, isSettingsLoaded) => {
    return Boolean(isRunning && isDatabaseReady && isSettingsLoaded)
  }
)

appSelectors.isAppReady = createSelector(
  appSelectors.infoLoaded,
  tickerSelectors.cryptoUnit,
  appSelectors.walletBalance,
  appSelectors.channelBalance,
  (infoLoaded, currency, walletBalance, channelBalance) => {
    return Boolean(infoLoaded && currency && channelBalance !== null && walletBalance !== null)
  }
)

export { appSelectors }

export default createReducer(initialState, ACTION_HANDLERS)
