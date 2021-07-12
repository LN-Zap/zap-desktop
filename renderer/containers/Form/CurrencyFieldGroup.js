import { connect } from 'react-redux'

import { CurrencyFieldGroup } from 'components/Form'
import { tickerSelectors, setCryptoUnit, setFiatTicker } from 'reducers/ticker'

const mapStateToProps = state => ({
  currentTicker: tickerSelectors.currentTicker(state),
  cryptoUnit: tickerSelectors.cryptoUnit(state),
  cryptoUnits: tickerSelectors.cryptoUnits(state),
  fiatCurrencies: tickerSelectors.fiatTickers(state),
  fiatCurrency: tickerSelectors.fiatTicker(state),
})

const mapDispatchToProps = {
  setCryptoCurrency: setCryptoUnit,
  setFiatCurrency: setFiatTicker,
}

export default connect(mapStateToProps, mapDispatchToProps)(CurrencyFieldGroup)
