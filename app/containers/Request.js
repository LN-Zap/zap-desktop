import { connect } from 'react-redux'
import { Request } from 'components/Request'
import { tickerSelectors } from 'reducers/ticker'
import { createInvoice, invoiceSelectors } from 'reducers/invoice'
import { showNotification } from 'reducers/notification'

const mapStateToProps = state => ({
  cryptoName: tickerSelectors.cryptoName(state),
  cryptoCurrency: state.ticker.currency,
  cryptoCurrencyTicker: tickerSelectors.currencyName(state),
  isProcessing: state.invoice.invoiceLoading,
  payReq: state.invoice.invoice,
  invoice: invoiceSelectors.invoice(state),
})

const mapDispatchToProps = {
  createInvoice,
  showNotification,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Request)
