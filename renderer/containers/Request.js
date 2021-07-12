import { connect } from 'react-redux'

import { isHoldInvoiceEnabled } from '@zap/utils/featureFlag'
import { Request } from 'components/Request'
import { setActivityModal } from 'reducers/activity'
import { createNewAddress } from 'reducers/address'
import { channelsSelectors } from 'reducers/channels'
import { infoSelectors } from 'reducers/info'
import { addInvoice, cancelInvoice, settleInvoice, invoiceSelectors } from 'reducers/invoice'
import { setTopModal } from 'reducers/modal'
import { showNotification, showError } from 'reducers/notification'
import { settingsSelectors } from 'reducers/settings'
import { fetchTickers, tickerSelectors } from 'reducers/ticker'
import { walletSelectors } from 'reducers/wallet'

const mapStateToProps = state => ({
  activeWalletSettings: walletSelectors.activeWalletSettings(state),
  chainName: infoSelectors.chainName(state),
  cryptoUnit: tickerSelectors.cryptoUnit(state),
  cryptoUnitName: tickerSelectors.cryptoUnitName(state),
  isProcessing: invoiceSelectors.isInvoiceCreating(state),
  isHoldInvoiceEnabled: isHoldInvoiceEnabled() && infoSelectors.hasInvoicesSupport(state),
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
