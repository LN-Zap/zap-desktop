import { connect } from 'react-redux'
import { setCurrency, setFiatTicker, tickerSelectors } from 'reducers/ticker'
import { infoSelectors } from 'reducers/info'
import { TransactionModal } from 'components/Activity/TransactionModal'

const mapStateToProps = state => ({
  currentTicker: tickerSelectors.currentTicker(state),
  cryptoCurrency: state.ticker.currency,
  cryptoCurrencies: tickerSelectors.currencyFilters(state),
  fiatCurrencies: state.ticker.fiatTickers,
  fiatCurrency: state.ticker.fiatTicker,
  network: infoSelectors.networkInfo(state)
})

const mapDispatchToProps = {
  setCryptoCurrency: setCurrency,
  setFiatCurrency: setFiatTicker
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TransactionModal)
