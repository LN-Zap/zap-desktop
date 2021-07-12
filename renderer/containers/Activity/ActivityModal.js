import { connect } from 'react-redux'

import { isHoldInvoiceEnabled } from '@zap/utils/featureFlag'
import { ActivityModal } from 'components/Activity/ActivityModal'
import { hideActivityModal, activitySelectors, saveInvoice } from 'reducers/activity'
import { infoSelectors } from 'reducers/info'
import {
  cancelInvoice,
  clearSettleInvoiceError,
  settleInvoice,
  invoiceSelectors,
} from 'reducers/invoice'
import { showNotification } from 'reducers/notification'

const mapStateToProps = state => ({
  isHoldInvoiceEnabled: isHoldInvoiceEnabled() && infoSelectors.hasInvoicesSupport(state),
  isInvoiceCancelling: invoiceSelectors.isInvoiceCancelling(state),
  isInvoiceSettling: invoiceSelectors.isInvoiceSettling(state),
  item: activitySelectors.activityModalItem(state),
  network: infoSelectors.networkSelector(state),
  networkInfo: infoSelectors.networkInfo(state),
  settleInvoiceError: invoiceSelectors.settleInvoiceError(state),
})

const mapDispatchToProps = {
  cancelInvoice,
  clearSettleInvoiceError,
  hideActivityModal,
  showNotification,
  saveInvoice,
  settleInvoice,
}

export default connect(mapStateToProps, mapDispatchToProps)(ActivityModal)
