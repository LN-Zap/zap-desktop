import { connect } from 'react-redux'
import { activitySelectors, hideErrorDetailsDialog, loadNextPage } from 'reducers/activity'
import { showNotification } from 'reducers/notification'
import Activity from 'components/Activity'

const mapStateToProps = state => ({
  currentActivity: activitySelectors.currentActivity(state),
  isErrorDialogOpen: activitySelectors.isErrorDialogOpen(state),
  errorDialogDetails: activitySelectors.errorDialogDetailsSelector(state),
})

const mapDispatchToProps = {
  hideErrorDetailsDialog,
  showNotification,
  loadNextPage,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Activity)
