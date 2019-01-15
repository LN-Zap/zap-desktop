import { connect } from 'react-redux'
import { setCurrency, tickerSelectors } from 'reducers/ticker'
import { openWalletModal } from 'reducers/address'
import { setFormType } from 'reducers/form'
import Wallet from 'components/Wallet'

const mapDispatchToProps = {
  openWalletModal,
  setCurrency,
  setFormType
}

const mapStateToProps = state => ({
  balance: state.balance,
  info: state.info,
  ticker: state.ticker,
  currentTicker: tickerSelectors.currentTicker(state),
  currencyFilters: tickerSelectors.currencyFilters(state)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Wallet)
