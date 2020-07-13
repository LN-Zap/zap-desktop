/**
 * @typedef {import('../index').State} State
 */

/**
 * isAccountLoading - Account loading state.
 *
 * @param {State} state Redux state
 * @returns {boolean} Boolean indicating wether the current account is in loading state
 */
export const isAccountLoading = state => state.account.isAccountLoading

/**
 * isLoggingIn - Account logging in state.
 *
 * @param {State} state Redux state
 * @returns {boolean} Boolean indicating wether the current account is being logged into
 */
export const isLoggingIn = state => state.account.isLoggingIn

/**
 * isLoggingIn - Account login state.
 *
 * @param {State} state Redux state
 * @returns {boolean} Boolean indicating wether the current account is logged in
 */
export const isLoggedIn = state => state.account.isLoggedIn

/**
 * loginError - Last known error that occured when trying to login to the account.
 *
 * @param {State} state Redux state
 * @returns {string|null} Error message
 */
export const loginError = state => state.account.loginError

/**
 * isAccountPasswordEnabled - Enabled state of the application password feature.
 *
 * @param {State} state Redux state
 * @returns {boolean|null} Boolean indicating wether the application password feature is enabled
 */
export const isAccountPasswordEnabled = state => state.account.isPasswordEnabled

/**
 * All selectors to export.
 */
export default {
  isAccountLoading,
  isLoggingIn,
  isLoggedIn,
  loginError,
  isAccountPasswordEnabled,
}
