import { connect } from 'react-redux'
import { activitySelectors, hideErrorDetailsDialog } from 'reducers/activity'
import { showNotification } from 'reducers/notification'
import Activity from 'components/Activity'

const mapStateToProps = state => ({
  currentActivity: activitySelectors.currentActivity(state)(state),
  isErrorDialogOpen: activitySelectors.isErrorDialogOpen(state),
  errorDialogDetails: activitySelectors.errorDialogDetailsSelector(state),
})

const mapDispatchToProps = {
  hideErrorDetailsDialog,
  showNotification,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Activity)
