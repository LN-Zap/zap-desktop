import { connect } from 'react-redux'
import { hideActivityModal, activitySelectors, saveInvoice } from 'reducers/activity'
import { infoSelectors } from 'reducers/info'
import { showNotification } from 'reducers/notification'
import { ActivityModal } from 'components/Activity/ActivityModal'

const mapStateToProps = state => ({
  item: activitySelectors.activityModalItem(state),
  network: infoSelectors.networkSelector(state),
  networkInfo: infoSelectors.networkInfo(state),
})

const mapDispatchToProps = {
  hideActivityModal,
  showNotification,
  saveInvoice,
}

export default connect(mapStateToProps, mapDispatchToProps)(ActivityModal)
