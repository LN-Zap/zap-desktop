/**
 * account - Active account.
 *
 * @param  {object} state redux state
 * @returns {object} currently active account
 */
export const account = state => state.account.account

/**
 * isAccountLoading - Account loading state.
 *
 * @param  {object} state redux state
 * @returns {boolean} Boolean indicating wether the current account is in loading state
 */
export const isAccountLoading = state => state.account.isAccountLoading

/**
 * initAccountError - Last known error that occured when trying to initialise the account.
 *
 * @param  {object} state redux state
 * @returns {string} Error message
 */
export const initAccountError = state => state.exchange.initAccountError

/**
 * isLoggingIn - Aaccount logging in state.
 *
 * @param  {object} state redux state
 * @returns {boolean} Boolean indicating wether the current account is being logged into
 */
export const isLoggingIn = state => state.account.isLoggingIn

/**
 * isLoggingIn - Account login state.
 *
 * @param  {object} state redux state
 * @returns {boolean} Boolean indicating wether the current account is logged in
 */
export const isLoggedIn = state => state.account.isLoggedIn

/**
 * loginError - Last known error that occured when trying to login to the account.
 *
 * @param  {object} state redux state
 * @returns {string} Error message
 */
export const loginError = state => state.account.loginError

/**
 * isAccountPasswordEnabled - Enabled state of the application password feature.
 *
 * @param  {object} state redux state
 * @returns {boolean} Boolean indicating wether the application password feature is enabled
 */
export const isAccountPasswordEnabled = state => state.account.isPasswordEnabled

/**
 * All selectors to export.
 */
export default {
  account,
  isAccountLoading,
  initAccountError,
  isLoggingIn,
  isLoggedIn,
  loginError,
  isAccountPasswordEnabled,
}
