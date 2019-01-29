import { connect } from 'react-redux'
import { Request } from 'components/Request'
import { tickerSelectors, setCurrency, setFiatTicker } from 'reducers/ticker'
import { createInvoice, invoiceSelectors } from 'reducers/invoice'
import { showNotification } from 'reducers/notification'

const mapStateToProps = state => ({
  cryptoName: tickerSelectors.cryptoName(state),
  currentTicker: tickerSelectors.currentTicker(state),
  cryptoCurrency: state.ticker.currency,
  cryptoCurrencyTicker: tickerSelectors.currencyName(state),
  cryptoCurrencies: tickerSelectors.currencyFilters(state),
  fiatCurrencies: state.ticker.fiatTickers,
  fiatCurrency: state.ticker.fiatTicker,
  isProcessing: state.invoice.invoiceLoading,
  payReq: state.invoice.invoice,
  invoice: invoiceSelectors.invoice(state)
})

const mapDispatchToProps = {
  createInvoice,
  setCryptoCurrency: setCurrency,
  setFiatCurrency: setFiatTicker,
  showNotification
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Request)
