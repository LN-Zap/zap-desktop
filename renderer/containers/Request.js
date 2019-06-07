import { connect } from 'react-redux'
import { Request } from 'components/Request'
import { fetchTickers, tickerSelectors } from 'reducers/ticker'
import { createInvoice, invoiceSelectors } from 'reducers/invoice'
import { showNotification } from 'reducers/notification'
import { walletSelectors } from 'reducers/wallet'
import { infoSelectors } from 'reducers/info'

const mapStateToProps = state => ({
  activeWalletSettings: walletSelectors.activeWalletSettings(state),
  chainName: infoSelectors.chainName(state),
  cryptoUnit: tickerSelectors.cryptoUnit(state),
  cryptoUnitName: tickerSelectors.cryptoUnitName(state),
  isProcessing: state.invoice.invoiceLoading,
  payReq: state.invoice.invoice,
  invoice: invoiceSelectors.invoice(state),
})

const mapDispatchToProps = {
  createInvoice,
  fetchTickers,
  showNotification,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Request)
