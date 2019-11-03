const accountSelectors = {}
export default { accountSelectors }

/**
 * account - Active account.
 *
 * @param  {object} state redux state
 * @returns {object} currently active account
 */
accountSelectors.account = state => state.account.account

/**
 * isAccountLoading - Account loading state.
 *
 * @param  {object} state redux state
 * @returns {boolean} Boolean indicating wether the current account is in loading state
 */
accountSelectors.isAccountLoading = state => state.account.isAccountLoading

/**
 * initAccountError - Last known error that occured when trying to initialise the account.
 *
 * @param  {object} state redux state
 * @returns {string} Error message
 */
accountSelectors.initAccountError = state => state.exchange.initAccountError

/**
 * isLoggingIn - Aaccount logging in state.
 *
 * @param  {object} state redux state
 * @returns {boolean} Boolean indicating wether the current account is being logged into
 */
accountSelectors.isLoggingIn = state => state.account.isLoggingIn

/**
 * isLoggingIn - Account login state.
 *
 * @param  {object} state redux state
 * @returns {boolean} Boolean indicating wether the current account is logged in
 */
accountSelectors.isLoggedIn = state => state.account.isLoggedIn

/**
 * loginError - Last known error that occured when trying to login to the account.
 *
 * @param  {object} state redux state
 * @returns {string} Error message
 */
accountSelectors.loginError = state => state.account.loginError

/**
 * isAccountPasswordEnabled - Enabled state of the application password feature.
 *
 * @param  {object} state redux state
 * @returns {boolean} Boolean indicating wether the application password feature is enabled
 */
accountSelectors.isAccountPasswordEnabled = state => state.account.isPasswordEnabled
