import { createSelector } from 'reselect'

import messages from 'components/Loading/messages'

import { appSelectors } from './app'
import { channelsSelectors } from './channels'
import { lndSelectors } from './lnd'
import { neutrinoSelectors } from './neutrino'
import { tickerSelectors } from './ticker'
import { transactionSelectors } from './transaction'
import { walletSelectors } from './wallet'

/**
 * Aggregated isLoading selector that accounts for current wallet and lnd state
 */
export const isLoading = createSelector(
  appSelectors.isLoading,
  walletSelectors.isWalletOpen,
  lndSelectors.isStartingLnd,
  walletSelectors.activeWalletSettings,
  (isAppLoading, isWalletOpen, isStartingLnd, wallet) =>
    isAppLoading || (isStartingLnd && wallet && wallet.type !== 'local')
)

/**
 * isLoadingPerPath - Allows to specify custom loading condition on a per router path basis
 * Add custom isLoading rules here.
 *
 * @param {object} state Redux state
 * @param {object} location React Router location object
 * @returns {boolean} Boolean indicating the loading state for path
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
 * Maps app state to a loading message
 * @param {} state
 */
export const getLoadingMessage = (state, location = {}) => {
  const activeWallet = walletSelectors.activeWalletSettings(state)
  const isLocal = activeWallet && activeWallet.type === 'local'

  const {
    loading,
    starting_lnd,
    connecting_to_lnd,
    starting_neutrino,
    fetching_tickers,
    starting_tor_proxy,
  } = messages
  if (neutrinoSelectors.isStartingNeutrino(state)) {
    return starting_neutrino
  }

  const { isTorProxyStarting } = state.lnd
  if (isTorProxyStarting) {
    return starting_tor_proxy
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

  if (pathname === '/app' || pathname === '/onboarding') {
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
  transactionSelectors.transactions,
  channelsSelectors.selectedChannel,
  (transactions, channelData) => {
    if (channelData && channelData.channelPoint) {
      const [fundingTxid] = channelData.channelPoint.split(':')
      // cross reference funding tx
      const fundingTx = fundingTxid && transactions.find(tx => tx.txHash === fundingTxid)
      if (fundingTx) {
        return { ...channelData, fundingTxTimestamp: fundingTx.timeStamp }
      }
    }
    return channelData
  }
)
