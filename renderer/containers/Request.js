import { connect } from 'react-redux'
import { isHoldInvoiceEnabled } from '@zap/utils/featureFlag'
import { Request } from 'components/Request'
import { fetchTickers, tickerSelectors } from 'reducers/ticker'
import { setActivityModal } from 'reducers/activity'
import { createNewAddress } from 'reducers/address'
import { addInvoice, cancelInvoice, settleInvoice, invoiceSelectors } from 'reducers/invoice'
import { showNotification, showError } from 'reducers/notification'
import { channelsSelectors } from 'reducers/channels'
import { walletSelectors } from 'reducers/wallet'
import { setTopModal } from 'reducers/modal'
import { infoSelectors } from 'reducers/info'
import { settingsSelectors } from 'reducers/settings'

const mapStateToProps = state => ({
  activeWalletSettings: walletSelectors.activeWalletSettings(state),
  chainName: infoSelectors.chainName(state),
  cryptoUnit: tickerSelectors.cryptoUnit(state),
  cryptoUnitName: tickerSelectors.cryptoUnitName(state),
  isProcessing: invoiceSelectors.isInvoiceCreating(state),
  isHoldInvoiceEnabled: isHoldInvoiceEnabled(),
  maxOneTimeReceive: channelsSelectors.maxOneTimeReceive(state),
  willUseFallback: settingsSelectors.currentConfig(state).invoices.useAddressFallback,
})

const mapDispatchToProps = {
  addInvoice,
  cancelInvoice,
  fetchTickers,
  setActivityModal,
  setTopModal,
  showNotification,
  createNewAddress,
  settleInvoice,
  showError,
}

export default connect(mapStateToProps, mapDispatchToProps)(Request)
