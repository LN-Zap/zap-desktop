import { connect } from 'react-redux'
import { activitySelectors, loadPage, ERROR_DETAILS_DIALOG_ID } from 'reducers/activity'
import { showNotification } from 'reducers/notification'
import { modalSelectors, closeDialog } from 'reducers/modal'
import Activity from 'components/Activity'

const hideErrorDetailsDialog = closeDialog.bind(null, ERROR_DETAILS_DIALOG_ID)

const mapStateToProps = state => ({
  currentActivity: activitySelectors.currentActivity(state),
  isErrorDialogOpen: modalSelectors.isDialogOpen(state, ERROR_DETAILS_DIALOG_ID),
  errorDialogDetails: activitySelectors.errorDialogDetails(state),
})

const mapDispatchToProps = {
  hideErrorDetailsDialog,
  showNotification,
  loadPage,
}

export default connect(mapStateToProps, mapDispatchToProps)(Activity)
