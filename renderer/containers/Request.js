import { connect } from 'react-redux'
import { isHoldInvoiceEnabled } from '@zap/utils/featureFlag'
import { Request } from 'components/Request'
import { fetchTickers, tickerSelectors } from 'reducers/ticker'
import { createNewAddress } from 'reducers/address'
import { createInvoice, cancelInvoice, invoiceSelectors } from 'reducers/invoice'
import { showNotification, showError } from 'reducers/notification'
import { channelsSelectors } from 'reducers/channels'
import { walletSelectors } from 'reducers/wallet'
import { infoSelectors } from 'reducers/info'
import { settingsSelectors } from 'reducers/settings'

const mapStateToProps = state => ({
  activeWalletSettings: walletSelectors.activeWalletSettings(state),
  chainName: infoSelectors.chainName(state),
  cryptoUnit: tickerSelectors.cryptoUnit(state),
  cryptoUnitName: tickerSelectors.cryptoUnitName(state),
  isProcessing: invoiceSelectors.isInvoiceCreating(state),
  isInvoiceCancelling: invoiceSelectors.isInvoiceCancelling(state),
  isHoldInvoiceEnabled: isHoldInvoiceEnabled(),
  invoice: invoiceSelectors.invoice(state),
  maxOneTimeReceive: channelsSelectors.maxOneTimeReceive(state),
  willUseFallback: settingsSelectors.currentConfig(state).invoices.useAddressFallback,
})

const mapDispatchToProps = {
  createInvoice,
  cancelInvoice,
  fetchTickers,
  showNotification,
  createNewAddress,
  showError,
}

export default connect(mapStateToProps, mapDispatchToProps)(Request)
