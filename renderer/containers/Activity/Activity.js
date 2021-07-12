import { connect } from 'react-redux'

import Activity from 'components/Activity'
import { activitySelectors, loadPage, ERROR_DETAILS_DIALOG_ID } from 'reducers/activity'
import { modalSelectors, closeDialog } from 'reducers/modal'
import { showNotification } from 'reducers/notification'

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
