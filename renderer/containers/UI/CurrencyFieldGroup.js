import { connect } from 'react-redux'
import { CurrencyFieldGroup } from 'components/UI'
import { tickerSelectors, setCurrency, setFiatTicker } from 'reducers/ticker'

const mapStateToProps = state => ({
  currentTicker: tickerSelectors.currentTicker(state),
  cryptoCurrency: state.ticker.currency,
  cryptoCurrencies: tickerSelectors.currencyFilters(state),
  fiatCurrencies: tickerSelectors.fiatTickers(state),
  fiatCurrency: tickerSelectors.fiatTicker(state),
})

const mapDispatchToProps = {
  setCryptoCurrency: setCurrency,
  setFiatCurrency: setFiatTicker,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CurrencyFieldGroup)
