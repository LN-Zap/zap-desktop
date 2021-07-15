import { connect } from 'react-redux'

import Wallet from 'components/Wallet'
import { openWalletModal } from 'reducers/address'
import { balanceSelectors } from 'reducers/balance'
import { infoSelectors } from 'reducers/info'
import { openModal } from 'reducers/modal'
import { tickerSelectors } from 'reducers/ticker'

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

export default connect(mapStateToProps, mapDispatchToProps)(Wallet)
