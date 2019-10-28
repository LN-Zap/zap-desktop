import React from 'react'
import { connect } from 'react-redux'
import { fetchPeers } from 'reducers/peers'
import { setIsWalletOpen } from 'reducers/wallet'
import { updateAutopilotNodeScores } from 'reducers/autopilot'
import { fetchActivityHistory } from 'reducers/activity'
import { fetchTransactions } from 'reducers/transaction'
import { appSelectors } from 'reducers/app'
import { finishLnurlWithdrawal, paySelectors } from 'reducers/pay'
import { initBackupService } from 'reducers/backup'
import { setModals, modalSelectors } from 'reducers/modal'
import { fetchSuggestedNodes } from 'reducers/channels'
import { initTickers } from 'reducers/ticker'
import App from 'components/App'
import ModalStack from './ModalStack'
import AppErrorBoundary from './ErrorBoundary'

const mapStateToProps = state => ({
  isAppReady: appSelectors.isAppReady(state),
  redirectPayReq: state.pay.redirectPayReq,
  modals: modalSelectors.getModalState(state),
  lnurlWithdrawParams: paySelectors.lnurlWithdrawParams(state),
  willShowLnurlWithdrawalPrompt: paySelectors.willShowLnurlWithdrawalPrompt(state),
})

const mapDispatchToProps = {
  fetchPeers,
  updateAutopilotNodeScores,
  fetchActivityHistory,
  setIsWalletOpen,
  fetchTransactions,
  setModals,
  initTickers,
  initBackupService,
  fetchSuggestedNodes,
  finishLnurlWithdrawal,
}

const ConnectedApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

const AppWithErrorBoundaries = props => (
  <AppErrorBoundary>
    <ConnectedApp {...props} />
    <ModalStack />
  </AppErrorBoundary>
)

export default AppWithErrorBoundaries
