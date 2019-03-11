import { createSelector } from 'reselect'
import messages from 'components/LoadingBolt/messages'
import { walletSelectors } from './wallet'
import { lndSelectors } from './lnd'
import { appSelectors } from './app'
import { tickerSelectors } from './ticker'
/**
 * Aggregated isLoading selector that accounts for current wallet and lnd state
 */
export const isLoading = createSelector(
  appSelectors.isLoading,
  walletSelectors.isWalletOpen,
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
    return !appSelectors.isAppReady(state)
  }

  if (pathname === '/syncing') {
    const { syncStatus, isLightningGrpcActive } = state.lnd
    return syncStatus === 'pending' || !isLightningGrpcActive
  }

  return false
}
/*
 * Maps app state to a loading message
 * @param {} state
 */
export const getLoadingMessage = state => {
  const activeWallet = walletSelectors.activeWalletSettings(state)
  const isLocal = activeWallet && activeWallet.type === 'local'

  const {
    loading,
    starting_lnd,
    connecting_to_lnd,
    starting_wallet_unlocker,
    connecting_to_unlocker,
    starting_neutrino,
    fetching_tickers,
  } = messages
  if (lndSelectors.isStartingLnd(state)) {
    return isLocal ? starting_lnd : connecting_to_lnd
  }

  if (lndSelectors.isStartingUnlocker(state)) {
    return isLocal ? starting_wallet_unlocker : connecting_to_unlocker
  }

  if (lndSelectors.isStartingNeutrino(state)) {
    return starting_neutrino
  }

  // path specific messages
  const { pathname } = state.router.location
  if (pathname === '/syncing') {
    const { isLightningGrpcActive } = state.lnd
    if (!isLightningGrpcActive) {
      return starting_lnd
    }
  }

  if (pathname === '/app') {
    if (!(tickerSelectors.currentTicker(state) && tickerSelectors.currencyName(state))) {
      return fetching_tickers
    }
  }

  return loading
}
