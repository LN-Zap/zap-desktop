import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import get from 'lodash.get'
import { tickerSelectors } from 'reducers/ticker'
import { closeWalletModal } from 'reducers/address'
import { openModal } from 'reducers/modal'
import { infoSelectors } from 'reducers/info'
import { fetchPeers } from 'reducers/peers'
import { fetchDescribeNetwork } from 'reducers/network'
import { showNotification, removeNotification } from 'reducers/notification'
import { setIsWalletOpen, walletSelectors } from 'reducers/wallet'
import App from 'components/App'

const mapDispatchToProps = {
  closeWalletModal,
  openModal,
  removeNotification,
  fetchPeers,
  fetchDescribeNetwork,
  setIsWalletOpen,
  showNotification
}

const mapStateToProps = state => ({
  lnd: state.lnd,
  ticker: state.ticker,
  address: state.address,
  info: state.info,
  payment: state.payment,
  transaction: state.transaction,
  channels: state.channels,
  balance: state.balance,
  requestform: state.requestform,
  invoice: state.invoice,
  error: state.error,
  network: state.network,
  settings: state.settings,
  wallet: state.wallet,

  activeWalletSettings: walletSelectors.activeWalletSettings(state),
  currentTicker: tickerSelectors.currentTicker(state),
  currencyFilters: tickerSelectors.currencyFilters(state),
  currencyName: tickerSelectors.currencyName(state),
  cryptoName: tickerSelectors.cryptoName(state),
  networkInfo: infoSelectors.networkInfo(state)
})

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const receiveModalProps = {
    isOpen: stateProps.address.walletModal,
    networkInfo: stateProps.networkInfo,
    cryptoName: stateProps.cryptoName,
    pubkey: get(stateProps.info, 'data.uris[0]') || get(stateProps.info, 'data.identity_pubkey'),
    address: stateProps.address.address,
    activeWalletSettings: stateProps.activeWalletSettings,
    alias: stateProps.info.data.alias,
    closeReceiveModal: dispatchProps.closeWalletModal,
    showNotification: dispatchProps.showNotification
  }

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    // props for the receive modal
    receiveModalProps
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(App)
)
