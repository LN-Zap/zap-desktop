import { connect } from 'react-redux'
import { fetchPeers } from 'reducers/peers'
import { setIsWalletOpen } from 'reducers/wallet'
import { fetchActivityHistory } from 'reducers/activity'
import { fetchTransactions } from 'reducers/transaction'
import { infoSelectors } from 'reducers/info'
import { openModal, modalSelectors } from 'reducers/modal'
import App from 'components/App'

const mapStateToProps = state => ({
  payReq: state.pay.payReq,
  networkInfo: infoSelectors.networkInfo(state),
  modals: modalSelectors.getModalState(state),
})

const mapDispatchToProps = {
  fetchPeers,
  fetchActivityHistory,
  setIsWalletOpen,
  fetchTransactions,
  openModal,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
