import { connect } from 'react-redux'
import { hideActivityModal, activitySelectors } from 'reducers/activity'
import { infoSelectors } from 'reducers/info'
import { showNotification } from 'reducers/notification'
import { ActivityModal } from 'components/Activity/ActivityModal'

const mapStateToProps = state => ({
  item: activitySelectors.activityModalItem(state),
  network: state.info.network,
  networkInfo: infoSelectors.networkInfo(state)
})

const mapDispatchToProps = {
  hideActivityModal,
  showNotification
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActivityModal)
