import { connect } from 'react-redux'
import { hideActivityModal, activitySelectors, saveInvoice } from 'reducers/activity'
import {
  cancelInvoice,
  clearSettleInvoiceError,
  settleInvoice,
  invoiceSelectors,
} from 'reducers/invoice'
import { infoSelectors } from 'reducers/info'
import { showNotification } from 'reducers/notification'
import { ActivityModal } from 'components/Activity/ActivityModal'

const mapStateToProps = state => ({
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
