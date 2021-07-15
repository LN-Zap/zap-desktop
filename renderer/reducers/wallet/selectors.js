import find from 'lodash/find'
import { createSelector } from 'reselect'

/**
 * wallets - All wallets.
 *
 * @param {object} state redux state
 * @returns {Array} List of all wallets
 */
export const wallets = state => state.wallet.wallets

/**
 * activeWallet - Active wallet.
 *
 * @param {object} state redux state
 * @returns {string} currently active wallet id
 */
export const activeWallet = state => state.settings.activeWallet

/**
 * isWalletsLoaded - Wallets loaded state.
 *
 * @param {object} state redux state
 * @returns {boolean} Boolean indicating wether wallets have been loaded
 */
export const isWalletsLoaded = state => state.wallet.isWalletsLoaded

/**
 * isWalletOpen - Wallet open state.
 *
 * @param {object} state redux state
 * @returns {boolean} Boolean indicating wether wallet is open
 */
export const isWalletOpen = state => state.settings.isWalletOpen

/**
 * activeWalletDir - Active wallet directory.
 *
 * @returns {string} Active wallet directory
 */
export const activeWalletDir = createSelector(
  activeWallet,
  wallets,
  (activeWalletId, allWallets) => {
    const activeWalletDetails = find(allWallets, { id: activeWalletId })
    if (activeWalletDetails && activeWalletDetails.type === 'local') {
      return window.Zap.getWalletDir(
        activeWalletDetails.chain,
        activeWalletDetails.network,
        activeWalletDetails.wallet
      )
    }
    return null
  }
)

/**
 * activeWalletSettings - Active wallet settings.
 *
 * @returns {object} Active wallet settings
 */
export const activeWalletSettings = createSelector(
  activeWallet,
  wallets,
  (activeWalletId, allWallets) => find(allWallets, { id: activeWalletId })
)

/**
 * hasWallets - Check wether at least one wallet exists.
 *
 * @returns {boolean} Boolean indicating wether there is at kleast one wallet.
 */
export const hasWallets = createSelector(wallets, allWallets => allWallets.length > 0)

/**
 * lndconnectQRCode - LndConnect QR code for currently active wallet.
 *
 * @returns {string} LndConnect QR code for currently active wallet
 */
export const lndconnectQRCode = createSelector(
  activeWalletSettings,
  settings => settings.lndconnectQRCode
)

/**
 * All selectors to export.
 */
export default {
  activeWallet,
  activeWalletDir,
  activeWalletSettings,
  hasWallets,
  isWalletsLoaded,
  isWalletOpen,
  lndconnectQRCode,
  wallets,
}
