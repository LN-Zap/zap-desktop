import { getIntl } from '@zap/i18n'
import createReducer from './utils/createReducer'
import { settingsSelectors } from './settings'
import messages from './messages'

// ------------------------------------
// Initial State
// ------------------------------------

export const initialState = {
  isAccountLoading: false,
  isAccountLoaded: false,
  initAccountError: null,
  isLoggingIn: false,
  loginError: null,
  isLoggedIn: false,
}

// ------------------------------------
// Constants
// ------------------------------------

export const INIT_ACCOUNT = 'INIT_ACCOUNT'
export const INIT_ACCOUNT_SUCCESS = 'INIT_ACCOUNT_SUCCESS'
export const INIT_ACCOUNT_FAILURE = 'INIT_ACCOUNT_FAILURE'

export const LOGIN = 'LOGIN'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'LOGIN_FAILURE'
export const LOGIN_CLEAR_ERROR = 'LOGIN_CLEAR_ERROR'

// ------------------------------------
// Actions
// ------------------------------------

/**
 * initAccounts - Fetch the current account info from the database and save into the store.
 * Should be called once when the app first loads.
 *
 * @returns {Function} Thunk
 */
export const initAccount = () => async (dispatch, getState) => {
  dispatch({ type: INIT_ACCOUNT })
  try {
    // Auto login user if password feature is disabled.
    const isAccountPasswordEnabled = accountSelectors.isAccountPasswordEnabled(getState())
    if (!isAccountPasswordEnabled) {
      dispatch({ type: LOGIN_SUCCESS })
    }
    dispatch({ type: INIT_ACCOUNT_SUCCESS })
  } catch (error) {
    dispatch({ type: INIT_ACCOUNT_FAILURE, error: error.message })
  }
}

/**
 * login - Perform account login.
 *
 * @param {string} password Password
 * @returns {Function} Thunk
 */
export const login = password => (dispatch, getState) => {
  dispatch({ type: LOGIN, password })
  try {
    const accountPassword = accountSelectors.accountPassword(getState())
    if (accountPassword === password) {
      dispatch({ type: LOGIN_SUCCESS })
    } else {
      throw new Error(getIntl().formatMessage(messages.account_invalid_password))
    }
  } catch (error) {
    dispatch({ type: LOGIN_FAILURE, error: error.message })
  }
}

/**
 * clearVerifyUserError - Clear verify user error.
 *
 * @returns {object} Action
 */
export const clearLoginError = () => (dispatch, getState) => {
  if (accountSelectors.loginError(getState())) {
    dispatch({
      type: 'LOGIN_CLEAR_ERROR',
    })
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------

const ACTION_HANDLERS = {
  [INIT_ACCOUNT]: state => {
    state.isAccountLoading = true
  },
  [INIT_ACCOUNT_SUCCESS]: state => {
    state.isAccountLoading = false
    state.isAccountLoaded = true
    state.initAccountError = null
  },
  [INIT_ACCOUNT_FAILURE]: (state, { error }) => {
    state.isAccountLoading = false
    state.initAccountError = error
  },

  [LOGIN]: state => {
    state.isLoggingIn = true
  },
  [LOGIN_SUCCESS]: state => {
    state.isLoggingIn = false
    state.isLoggedIn = true
    state.loginError = null
  },
  [LOGIN_FAILURE]: (state, { error }) => {
    state.isLoggingIn = false
    state.loginError = error
  },
  [LOGIN_CLEAR_ERROR]: state => {
    state.loginError = null
  },
}

// ------------------------------------
// Selectors
// ------------------------------------

const accountSelector = state => state.account.account
const isAccountLoadingSelector = state => state.account.isAccountLoading
const initAccountErrorSelector = state => state.exchange.initAccountError

const isLoggingInSelector = state => state.account.isLoggingIn
const isLoggedInSelector = state => state.account.isLoggedIn
const loginErrorSelector = state => state.account.loginError

const isAccountPasswordEnabledSelector = state =>
  settingsSelectors.currentConfig(state).password.active
const accountPasswordSelector = state => settingsSelectors.currentConfig(state).password.value

const accountSelectors = {}

accountSelectors.account = accountSelector
accountSelectors.isAccountLoading = isAccountLoadingSelector
accountSelectors.initAccountError = initAccountErrorSelector

accountSelectors.isLoggingIn = isLoggingInSelector
accountSelectors.isLoggedIn = isLoggedInSelector
accountSelectors.loginError = loginErrorSelector

accountSelectors.isAccountPasswordEnabled = isAccountPasswordEnabledSelector
accountSelectors.accountPassword = accountPasswordSelector

export { accountSelectors }

// ------------------------------------
// Reducer
// ------------------------------------

export default createReducer(initialState, ACTION_HANDLERS)
