import { send } from 'redux-electron-ipc'
import { getIntl } from '@zap/i18n'
import { sha256digest } from '@zap/utils/crypto'
import createReducer from './utils/createReducer'
import { settingsSelectors, saveConfigOverrides } from './settings'
import { closeDialog } from './modal'
import { showNotification } from './notification'
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

export const CHANGE_PASSWORD_DIALOG_ID = 'CHANGE_PASSWORD_DIALOG'
export const PASSWORD_PROMPT_DIALOG_ID = 'PASSWORD_PROMPT_DIALOG'
export const PASSWORD_SET_DIALOG_ID = 'PASSWORD_SET_DIALOG_ID'

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
 * setPassword - Updates wallet password.
 *
 * @param {string} password new password
 * @returns {Function} Thunk
 */
const setPassword = password => async dispatch => {
  dispatch(send('setPassword', { password: await sha256digest(password) }))
}

/**
 * changePassword - Changes existing password.
 *
 * @param {object} params password params
 * @param {string} params.newPassword new password
 * @param {string} params.oldPassword old password
 * @returns {Function} Thunk
 */
export const changePassword = ({ newPassword, oldPassword }) => async dispatch => {
  try {
    const intl = getIntl()
    await dispatch(requirePassword(oldPassword))
    await dispatch(setPassword(newPassword))
    dispatch(closeDialog(CHANGE_PASSWORD_DIALOG_ID))
    dispatch(showNotification(intl.formatMessage(messages.account_password_updated)))
  } catch (error) {
    dispatch({ type: LOGIN_FAILURE, error: error.message })
  }
}

/**
 * enablePassword - Enables app-wide password protection.
 *
 * @param {string} password to be used further on.
 * @returns {Function} Thunk
 */
export const enablePassword = ({ password }) => async dispatch => {
  try {
    const intl = getIntl()
    dispatch(setPassword(password))
    dispatch(
      saveConfigOverrides({
        password: {
          active: true,
        },
      })
    )
    dispatch(closeDialog(PASSWORD_SET_DIALOG_ID))
    dispatch(showNotification(intl.formatMessage(messages.account_password_enabled)))
  } catch (error) {
    dispatch({ type: LOGIN_FAILURE, error: error.message })
  }
}

/**
 * enablePassword - Disables app-wide password protection.
 *
 * @param {string} password current password.
 * @returns {Function} Thunk
 */
export const disablePassword = ({ password }) => async dispatch => {
  try {
    const intl = getIntl()
    await dispatch(requirePassword(password))
    dispatch(send('deletePassword'))
    dispatch(
      saveConfigOverrides({
        password: {
          active: false,
        },
      })
    )
    dispatch(closeDialog(PASSWORD_PROMPT_DIALOG_ID))
    dispatch(showNotification(intl.formatMessage(messages.account_password_disabled)))
  } catch (error) {
    dispatch({ type: LOGIN_FAILURE, error: error.message })
  }
}

/**
 * requirePassword - Password protect routine. Should be placed before protected code.
 *
 * @param {string} password current password.
 * @returns {Promise} Promise that fulfills after login attempt (either successful or not)
 */
const requirePassword = password => dispatch => {
  return new Promise((resolve, reject) => {
    dispatch(send('getPassword'))
    // compare hash received from the main thread to a hash of a password provided
    window.ipcRenderer.once('getPassword', async (event, { password: hash }) => {
      const passwordHash = await sha256digest(password)
      if (hash === passwordHash) {
        resolve()
      } else {
        reject(new Error(getIntl().formatMessage(messages.account_invalid_password)))
      }
    })
  })
}

/**
 * login - Perform account login.
 *
 * @param {string} password Password
 * @returns {Function} Thunk
 */
export const login = password => async dispatch => {
  try {
    dispatch({ type: LOGIN, password })
    await dispatch(requirePassword(password))
    dispatch({ type: LOGIN_SUCCESS })
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

const isChangePasswordDialogOpenSelector = state => state.account.isChangePasswordDialogOpen

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
accountSelectors.isChangePasswordDialogOpen = isChangePasswordDialogOpenSelector

export { accountSelectors }

// ------------------------------------
// Reducer
// ------------------------------------

export default createReducer(initialState, ACTION_HANDLERS)
