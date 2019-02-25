import { createSelector } from 'reselect'
import { walletSelectors } from './wallet'
import { lndSelectors } from './lnd'
import { appSelectors } from './app'
import { tickerSelectors } from './ticker'
/**
 * Aggregated isLoading selector that accounts for current wallet and lnd state
 */
export const isLoading = createSelector(
  appSelectors.isLoading,
  walletSelectors.hasOpenWallet,
  lndSelectors.isStartingLnd,
  (isAppLoading, isWalletOpen, isStartingLnd) => isAppLoading || (isStartingLnd && isWalletOpen)
)

/**
 * Allows to specify custom loading condition on a per router path basis
 * Add custom isLoading rules here
 * @param {} state
 */
export const isLoadingPerPath = state => {
  const { pathname } = state.router.location

  if (pathname === '/app') {
    const { walletBalance, channelBalance } = state.balance
    return (
      !tickerSelectors.currentTicker(state) ||
      !tickerSelectors.currencyName(state) ||
      channelBalance === null ||
      walletBalance === null
    )
  }

  if (pathname === '/syncing') {
    const { syncStatus, lightningGrpcActive } = state.lnd
    return syncStatus === 'pending' || !lightningGrpcActive
  }

  return false
}
