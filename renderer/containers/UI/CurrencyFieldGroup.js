import { connect } from 'react-redux'
import { CurrencyFieldGroup } from 'components/UI'
import { tickerSelectors, setCryptoUnit, setFiatTicker } from 'reducers/ticker'

const mapStateToProps = state => ({
  currentTicker: tickerSelectors.currentTicker(state),
  cryptoCurrency: tickerSelectors.cryptoUnit(state),
  cryptoCurrencies: tickerSelectors.cryptoFilters(state),
  fiatCurrencies: tickerSelectors.fiatTickers(state),
  fiatCurrency: tickerSelectors.fiatTicker(state),
})

const mapDispatchToProps = {
  setCryptoCurrency: setCryptoUnit,
  setFiatCurrency: setFiatTicker,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CurrencyFieldGroup)
