import { getIntl } from '@zap/i18n'
import createReducer from '@zap/utils/createReducer'
import { mainLog } from '@zap/utils/log'
import waitForIpcEvent from '@zap/utils/waitForIpc'
import { closeDialog } from 'reducers/modal'
import { showNotification } from 'reducers/notification'

import * as constants from './constants'
import messages from './messages'
import { loginError } from './selectors'

const {
  INIT_ACCOUNT,
  INIT_ACCOUNT_SUCCESS,
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_CLEAR_ERROR,
  CHANGE_PASSWORD_DIALOG_ID,
  PASSWORD_PROMPT_DIALOG_ID,
  PASSWORD_SET_DIALOG_ID,
  SET_IS_PASSWORD_ENABLED,
  LOGIN_NOT_ALLOWED,
} = constants

// ------------------------------------
// Initial State
// ------------------------------------

/**
 * @typedef State
 * @property {boolean} isAccountLoading Boolean indicating if account is loading.
 * @property {boolean} isAccountLoaded Boolean indicating if account is loaded.
 * @property {boolean} isLoggingIn Boolean indicating if login is in process.
 * @property {boolean} isLoggedIn Boolean indicating if user is logged in.
 * @property {boolean|null} isPasswordEnabled Boolean indicating if user password is enabled.
 * @property {string|null} loginError Login error message.
 */

/** @type {State} */
export const initialState = {
  isAccountLoading: false,
  isAccountLoaded: false,
  isLoggingIn: false,
  isLoggedIn: false,
  isPasswordEnabled: null,
  loginError: null,
}

// ------------------------------------
// Actions
// ------------------------------------

/**
 * setIsPasswordEnabled - Whether password is set for the account.
 *
 * @param {boolean} value Boolean indicating wether password is enabled.
 * @returns {object} Action
 */
const setIsPasswordEnabled = value => ({
  type: SET_IS_PASSWORD_ENABLED,
  value,
})

/**
 * checkAccountPasswordEnabled - Checks whether app password is set via checking secure storage.
 * Dispatches setIsPasswordEnabled on completion.
 *
 * @returns {(dispatch:Function) => Promise<boolean>} Thunk
 */
const checkAccountPasswordEnabled = () => async dispatch => {
  const { value } = await dispatch(waitForIpcEvent('hasPassword'))
  dispatch(setIsPasswordEnabled(value))
  return value
}

/**
 * initAccount - Fetch the current account info from the database and save into the store.
 * Should be called once when the app first loads.
 *
 * @returns {(dispatch:Function) => Promise<void>} Thunk
 */
export const initAccount = () => async dispatch => {
  dispatch({ type: INIT_ACCOUNT })
  try {
    // Auto login user if password feature is disabled.
    const isAccountPasswordEnabled = await dispatch(checkAccountPasswordEnabled())
    if (!isAccountPasswordEnabled) {
      dispatch({ type: LOGIN_SUCCESS })
    }
    dispatch({ type: INIT_ACCOUNT_SUCCESS })
  } catch (e) {
    mainLog.warn('checkAccountPasswordEnabled error: %o', e)
    dispatch({ type: LOGIN_FAILURE, error: LOGIN_NOT_ALLOWED })
  }
}

/**
 * setPassword - Updates wallet password.
 *
 * @param {string} password new password
 * @returns {(dispatch:Function) => Promise<void>} Thunk
 */
const setPassword = password => async dispatch => {
  const { sha256digest } = window.Zap
  dispatch(waitForIpcEvent('setPassword', { value: await sha256digest(password, 'hex') }))
}

/**
 * requirePassword - Password protect routine. Should be placed before protected code.
 *
 * @param {string} password current password.
 * @returns {(dispatch:Function) => Promise<boolean>} Thunk
 */
const requirePassword = password => async dispatch => {
  const { sha256digest } = window.Zap
  const { password: hash } = await dispatch(waitForIpcEvent('getPassword'))
  const passwordHash = await sha256digest(password, 'hex')
  // compare hash received from the main thread to a hash of a password provided
  if (hash === passwordHash) {
    return true
  }
  throw new Error(getIntl().formatMessage(messages.account_invalid_password))
}

/**
 * changePassword - Changes existing password.
 *
 * @param {object} params password params
 * @param {string} params.newPassword new password
 * @param {string} params.oldPassword old password
 * @returns {(dispatch:Function) => Promise<void>} Thunk
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
 * @param {object} params password params
 * @param {string} params.password to be used further on.
 * @returns {(dispatch:Function) => Promise<void>} Thunk
 */
export const enablePassword = ({ password }) => async dispatch => {
  try {
    const intl = getIntl()
    await dispatch(setPassword(password))
    dispatch(closeDialog(PASSWORD_SET_DIALOG_ID))
    dispatch(setIsPasswordEnabled(true))
    dispatch(showNotification(intl.formatMessage(messages.account_password_enabled)))
  } catch (error) {
    dispatch({ type: LOGIN_FAILURE, error: error.message })
  }
}

/**
 * disablePassword - Disables app-wide password protection.
 *
 * @param {object} params password params
 * @param {string} params.password current password.
 * @returns {(dispatch:Function) => Promise<void>} Thunk
 */
export const disablePassword = ({ password }) => async dispatch => {
  try {
    const intl = getIntl()
    await dispatch(requirePassword(password))
    await dispatch(waitForIpcEvent('deletePassword'))
    dispatch(setIsPasswordEnabled(false))
    dispatch(closeDialog(PASSWORD_PROMPT_DIALOG_ID))
    dispatch(showNotification(intl.formatMessage(messages.account_password_disabled)))
  } catch (error) {
    dispatch({ type: LOGIN_FAILURE, error: error.message })
  }
}

/**
 * login - Perform account login.
 *
 * @param {string} password Password
 * @returns {(dispatch:Function) => Promise<void>} Thunk
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
 * clearLoginError - Clear login user error.
 *
 * @returns {(dispatch:Function, getState:Function) => void} Thunk
 */
export const clearLoginError = () => (dispatch, getState) => {
  if (loginError(getState())) {
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
  [SET_IS_PASSWORD_ENABLED]: (state, { value }) => {
    state.isPasswordEnabled = value
  },
}

// ------------------------------------
// Reducer
// ------------------------------------

export default createReducer(initialState, ACTION_HANDLERS)
