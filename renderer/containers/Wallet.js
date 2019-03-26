import { connect } from 'react-redux'
import { tickerSelectors } from 'reducers/ticker'
import { openWalletModal } from 'reducers/address'
import { openModal } from 'reducers/modal'
import { balanceSelectors } from 'reducers/balance'
import { infoSelectors } from 'reducers/info'
import Wallet from 'components/Wallet'

const mapDispatchToProps = {
  openWalletModal,
  openModal,
}

const mapStateToProps = state => ({
  networkInfo: infoSelectors.networkInfo(state),
  ticker: state.ticker,
  totalBalance: balanceSelectors.totalBalance(state),
  currentTicker: tickerSelectors.currentTicker(state),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Wallet)
