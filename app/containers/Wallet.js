import { connect } from 'react-redux'
import { setCurrency, tickerSelectors } from 'reducers/ticker'
import { openWalletModal } from 'reducers/address'
import { setFormType } from 'reducers/form'
import { balanceSelectors } from 'reducers/balance'
import Wallet from 'components/Wallet'

const mapDispatchToProps = {
  openWalletModal,
  setCurrency,
  setFormType
}

const mapStateToProps = state => ({
  info: state.info,
  ticker: state.ticker,
  totalBalance: balanceSelectors.totalBalance(state),
  currentTicker: tickerSelectors.currentTicker(state),
  currencyFilters: tickerSelectors.currencyFilters(state)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Wallet)
