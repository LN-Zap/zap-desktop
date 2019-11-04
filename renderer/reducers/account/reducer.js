import createReducer from '@zap/utils/createReducer'
import { getIntl } from '@zap/i18n'
import { mainLog } from '@zap/utils/log'
import waitForIpcEvent from '@zap/utils/waitForIpc'
import { closeDialog } from 'reducers/modal'
import { showNotification } from 'reducers/notification'
import { loginError } from './selectors'
import { byteToHexString, hexStringToByte } from '@zap/utils/byteutils'
import { encrypt, decrypt } from '@zap/utils/aes'
import { initDb } from '@zap/renderer/store/db'
import { genEncryptionKey, hashPassword } from './utils'
import messages from './messages'
import * as constants from './constants'

const {
  INIT_ACCOUNT,
  INIT_ACCOUNT_SUCCESS,
  INIT_ACCOUNT_FAILURE,
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_CLEAR_ERROR,
  CHANGE_PASSWORD_DIALOG_ID,
  PASSWORD_PROMPT_DIALOG_ID,
  PASSWORD_SET_DIALOG_ID,
  SET_IS_PASSWORD_ENABLED,
  LOGIN_NOT_ALLOWED,
  SECRET_NONCE,
} = constants

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
  isPasswordEnabled: null,
}

// ------------------------------------
// Actions
// ------------------------------------

/**
 * setIsPasswordEnabled - Whether password is set for the account.
 *
 * @param {string} value value
 * @returns {object} Action
 */
const setIsPasswordEnabled = value => ({
  type: SET_IS_PASSWORD_ENABLED,
  value,
})

/**
 * checkAccountPasswordEnabled - Checks whether app password is enabled.
 * Password determined as enabled if there is an encryption key in secure storage or a password hash in database.
 *
 * @returns {Function} Thunk
 */
const checkAccountPasswordEnabled = () => async dispatch => {
  const { value: hasEncryptionKey } = await dispatch(waitForIpcEvent('hasEncryptionKey'))
  const hasPassword = await window.db.secrets.get('password')
  const isEnabled = hasEncryptionKey || hasPassword
  dispatch(setIsPasswordEnabled(isEnabled))
  return isEnabled
}

/**
 * initAccount - Fetch the current account info from the database and save into the store.
 * Should be called once when the app first loads.
 *
 * @returns {Function} Thunk
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
 * getEncryptionKey - Fetch current encryption key from secure storage and decrypt with user supplied password.
 *
 * @param {string} password current password.
 * @returns {Function} Thunk
 */
export const getEncryptionKey = password => async dispatch => {
  const { encryptionKey } = await dispatch(waitForIpcEvent('getEncryptionKey'))
  if (encryptionKey) {
    const encoded = hexStringToByte(encryptionKey)
    if (!password) {
      return encoded
    }
    const decrypted = decrypt(encoded, password)
    return decrypted
  }
  return null
}

/**
 * setEncryptionKey - Updates current encryption key.
 *
 * @param {string} key New key
 * @param {string} password Password used to encerypt the key
 * @returns {Function} Thunk
 */
export const setEncryptionKey = (key, password) => async dispatch => {
  // Encrypt the key with the user supplied password.
  const encryptedKey = encrypt(key, password)
  const encryptionKeyAsSting = byteToHexString(encryptedKey)

  // Store the encrypted database encryption key in secure storage.
  await dispatch(waitForIpcEvent('setEncryptionKey', { value: encryptionKeyAsSting }))
}

/**
 * changeEncryptionKey - Generate new encryption key encrypted with user password and use to reencrypt database.
 *
 * @param  {string} oldPassword Old password
 * @param  {string} newPassword New password
 * @returns {Function} Thunk
 */
export const changeEncryptionKey = (oldPassword, newPassword) => async dispatch => {
  try {
    // Fetch the existing encryption key.
    let oldKey
    if (oldPassword) {
      oldKey = await dispatch(getEncryptionKey(oldPassword))
    }

    // Generate a new encryption key.
    const newKey = genEncryptionKey()

    // Re-encrypt database with new password/key.
    await initDb({ oldKey, newKey })

    // Save the new encryption key
    await dispatch(setEncryptionKey(newKey, newPassword))

    // Save updated password hash.
    const hashedPassword = await hashPassword(newPassword)
    await window.db.secrets.put({ key: 'password', value: hashedPassword })
  } catch (e) {
    mainLog.error('A problem was encountered when changing encryption key: %s', e.message)
    throw e
  }
}

/**
 * disableEncryption - Decrypt the database and delete encryption keys.
 *
 * @param  {string} oldPassword Existing encryption password
 * @returns {Function} Thunk
 */
export const disableEncryption = oldPassword => async dispatch => {
  try {
    // Fetch the existing encryption key.
    const oldKey = await dispatch(getEncryptionKey(oldPassword))

    // Decrypt the database..
    await initDb({ oldKey, newKey: null })

    // Delete old encryption key and password.
    await dispatch(waitForIpcEvent('deleteEncryptionKey'))
    window.db.secrets.delete('password')
  } catch (e) {
    mainLog.error('A problem was encountered when disabling encryption: %s', e.message)
    throw e
  }
}

/**
 * requirePassword - Password protect routine. Should be placed before protected code.
 *
 * @param {string} password Current password.
 * @returns {Promise} Promise that fulfills after login attempt (either successful or not)
 */
const requirePassword = password => async dispatch => {
  const { sha256digest } = window.Zap
  const key = await dispatch(getEncryptionKey(password))

  // Use supplied password to decryot the database.
  await initDb({ oldKey: key, newKey: key })

  // Compare hash received from the main thread to a hash of a password provided
  try {
    const { value: existingHash } = await window.db.secrets.get('password')
    const newHash = await sha256digest(password)

    mainLog.info('Comparing password hashes:')
    mainLog.info(' - old: %s', existingHash)
    mainLog.info(' - new: %s', newHash)

    if (existingHash === newHash) {
      return true
    }
    throw new Error('passwords do not match')
  } catch (e) {
    throw new Error(getIntl().formatMessage(messages.account_invalid_password))
  }
}

/**
 * changePassword - Changes existing password.
 *
 * @param {object} params password params
 * @param {string} params.oldPassword old password
 * @param {string} params.newPassword new password
 * @returns {Function} Thunk
 */
export const changePassword = ({ oldPassword, newPassword }) => async dispatch => {
  try {
    const intl = getIntl()
    await dispatch(requirePassword(oldPassword))
    await dispatch(changeEncryptionKey(oldPassword, newPassword))
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
    await dispatch(changeEncryptionKey(null, password))
    dispatch(closeDialog(PASSWORD_SET_DIALOG_ID))
    dispatch(setIsPasswordEnabled(true))
    dispatch(showNotification(intl.formatMessage(messages.account_password_enabled)))

    // Add dummy value to secrets store to provide an easy way to check if encryption/decryption is working.
    if (!(await window.db.secrets.get('nonce'))) {
      await window.db.secrets.put({
        key: 'nonce',
        value: SECRET_NONCE,
      })
    }
  } catch (error) {
    dispatch({ type: LOGIN_FAILURE, error: error.message })
  }
}

/**
 * disablePassword - Disables app-wide password protection.
 *
 * @param {string} password current password.
 * @returns {Function} Thunk
 */
export const disablePassword = ({ password }) => async dispatch => {
  try {
    const intl = getIntl()
    await dispatch(requirePassword(password))
    await dispatch(disableEncryption(password))
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
 * clearLoginError - Clear login user error.
 *
 * @returns {Function} Thunk
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
  [SET_IS_PASSWORD_ENABLED]: (state, { value }) => {
    state.isPasswordEnabled = value
  },
}

// ------------------------------------
// Reducer
// ------------------------------------

export default createReducer(initialState, ACTION_HANDLERS)
