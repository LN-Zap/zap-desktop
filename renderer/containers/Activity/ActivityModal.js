import { connect } from 'react-redux'
import { hideActivityModal, activitySelectors, saveInvoice } from 'reducers/activity'
import { cancelInvoice, invoiceSelectors } from 'reducers/invoice'
import { infoSelectors } from 'reducers/info'
import { showNotification } from 'reducers/notification'
import { ActivityModal } from 'components/Activity/ActivityModal'

const mapStateToProps = state => ({
  isInvoiceCancelling: invoiceSelectors.isInvoiceCancelling(state),
  item: activitySelectors.activityModalItem(state),
  network: infoSelectors.networkSelector(state),
  networkInfo: infoSelectors.networkInfo(state),
})

const mapDispatchToProps = {
  cancelInvoice,
  hideActivityModal,
  showNotification,
  saveInvoice,
}

export default connect(mapStateToProps, mapDispatchToProps)(ActivityModal)
