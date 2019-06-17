import { createSelector } from 'reselect'
import messages from 'components/LoadingBolt/messages'
import { walletSelectors } from './wallet'
import { neutrinoSelectors } from './neutrino'
import { lndSelectors } from './lnd'
import { appSelectors } from './app'
import { tickerSelectors } from './ticker'
import { transactionsSelectors } from './transaction'
import { channelsSelectors } from './channels'

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
 *
 * @param {} state
 */
export const isLoadingPerPath = (state, location = {}) => {
  const { pathname } = location

  if (pathname === '/') {
    return !appSelectors.isRootReady(state)
  }

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
 * getWalletRedirect Get a wallet redirect object.
 */
export const getWalletRedirect = (wallet, subpath = '') => ({
  pathname: `/home/wallet/${wallet.id}${subpath}`,
  state: { wallet },
})

/*
 * Maps app state to a loading message
 * @param {} state
 */
export const getLoadingMessage = (state, location = {}) => {
  const activeWallet = walletSelectors.activeWalletSettings(state)
  const isLocal = activeWallet && activeWallet.type === 'local'

  const { loading, starting_lnd, connecting_to_lnd, starting_neutrino, fetching_tickers } = messages
  if (neutrinoSelectors.isStartingNeutrino(state)) {
    return starting_neutrino
  }

  if (lndSelectors.isStartingLnd(state)) {
    return isLocal ? starting_lnd : connecting_to_lnd
  }

  // path specific messages
  const { pathname } = location
  if (pathname === '/syncing') {
    const { isLightningGrpcActive } = state.lnd
    if (!isLightningGrpcActive) {
      return starting_lnd
    }
  }

  if (pathname === '/app') {
    if (!(tickerSelectors.currentTicker(state) && tickerSelectors.cryptoUnitName(state))) {
      return fetching_tickers
    }
  }

  return loading
}

/**
 * Creates a selected channel selector with an additional data
 * such as funding  tx timestamp
 */
export const decoratedSelectedChannel = createSelector(
  transactionsSelectors.rawTransactionsSelector,
  channelsSelectors.selectedChannel,
  (transactions, channelData) => {
    if (channelData && channelData.channel_point) {
      const [funding_txid] = channelData.channel_point.split(':')
      // cross reference funding tx
      const fundingTx = funding_txid && transactions.find(tx => tx.tx_hash === funding_txid)
      if (fundingTx) {
        return { ...channelData, fundingTxTimestamp: fundingTx.time_stamp }
      }
    }
    return channelData
  }
)
