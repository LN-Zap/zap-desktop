import { connect } from 'react-redux'
import { tickerSelectors } from 'reducers/ticker'
import { openWalletModal } from 'reducers/address'
import { setFormType } from 'reducers/form'
import { balanceSelectors } from 'reducers/balance'
import Wallet from 'components/Wallet'

const mapDispatchToProps = {
  openWalletModal,
  setFormType
}

const mapStateToProps = state => ({
  info: state.info,
  ticker: state.ticker,
  totalBalance: balanceSelectors.totalBalance(state),
  currentTicker: tickerSelectors.currentTicker(state)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Wallet)
