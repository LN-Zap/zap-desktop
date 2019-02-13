import { createSelector } from 'reselect'
import { walletSelectors } from './wallet'
import { lndSelectors } from './lnd'
import { appSelectors } from './app'

/**
 * Aggregated isLoading selector that accounts for current wallet and lnd state
 */
export const isLoading = createSelector(
  appSelectors.isLoading,
  walletSelectors.hasOpenWallet,
  lndSelectors.isStartingLnd,
  (isAppLoading, isWalletOpen, isStartingLnd) => isAppLoading || (isStartingLnd && isWalletOpen)
)
