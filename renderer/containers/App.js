import { connect } from 'react-redux'
import { fetchPeers } from 'reducers/peers'
import { setIsWalletOpen } from 'reducers/wallet'
import { updateAutopilotNodeScores } from 'reducers/autopilot'
import { fetchActivityHistory } from 'reducers/activity'
import { fetchTransactions } from 'reducers/transaction'
import { appSelectors } from 'reducers/app'
import { initBackupService } from 'reducers/backup'
import { setModals, modalSelectors } from 'reducers/modal'
import { fetchSuggestedNodes } from 'reducers/channels'
import { initTickers } from 'reducers/ticker'

import App from 'components/App'

const mapStateToProps = state => ({
  isAppReady: appSelectors.isAppReady(state),
  redirectPayReq: state.pay.redirectPayReq,
  modals: modalSelectors.getModalState(state),
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
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
