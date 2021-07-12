import React from 'react'

import { connect } from 'react-redux'

import App from 'components/App'
import { initActivityHistory } from 'reducers/activity'
import { appSelectors } from 'reducers/app'
import { updateAutopilotNodeScores } from 'reducers/autopilot'
import { initBackupService } from 'reducers/backup'
import { fetchSuggestedNodes } from 'reducers/channels'
import { infoSelectors } from 'reducers/info'
import {
  finishLnurlAuth,
  finishLnurlChannel,
  finishLnurlWithdraw,
  lnurlSelectors,
} from 'reducers/lnurl'
import { setModals, modalSelectors } from 'reducers/modal'
import { fetchDescribeNetwork } from 'reducers/network'
import { paySelectors } from 'reducers/pay'
import { fetchPeers } from 'reducers/peers'
import { initTickers } from 'reducers/ticker'
import { fetchTransactions } from 'reducers/transaction'
import { setIsWalletOpen, walletSelectors } from 'reducers/wallet'

import AppErrorBoundary from './ErrorBoundary'
import ModalStack from './ModalStack'

const mapStateToProps = state => ({
  activeWalletSettings: walletSelectors.activeWalletSettings(state),
  isAppReady: appSelectors.isAppReady(state),
  isSyncedToGraph: infoSelectors.isSyncedToGraph(),
  redirectPayReq: paySelectors.redirectPayReq(state),
  modals: modalSelectors.getModalState(state),
  lnurlWithdrawParams: lnurlSelectors.lnurlWithdrawParams(state),
  willShowLnurlAuthPrompt: lnurlSelectors.willShowLnurlAuthPrompt(state),
  willShowLnurlWithdrawPrompt: lnurlSelectors.willShowLnurlWithdrawPrompt(state),
  willShowLnurlChannelPrompt: lnurlSelectors.willShowLnurlChannelPrompt(state),
})

const mapDispatchToProps = {
  fetchDescribeNetwork,
  fetchPeers,
  updateAutopilotNodeScores,
  initActivityHistory,
  setIsWalletOpen,
  fetchTransactions,
  setModals,
  initTickers,
  initBackupService,
  fetchSuggestedNodes,
  finishLnurlAuth,
  finishLnurlChannel,
  finishLnurlWithdraw,
}

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App)

const AppWithErrorBoundaries = props => (
  <AppErrorBoundary>
    <ConnectedApp {...props} />
    <ModalStack />
  </AppErrorBoundary>
)

export default AppWithErrorBoundaries
