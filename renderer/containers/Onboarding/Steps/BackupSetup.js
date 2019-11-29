import { connect } from 'react-redux'
import { BackupSetup } from 'components/Onboarding/Steps'
import { SKIP_BACKUP_DIALOG_ID } from 'reducers/onboarding'
import { showError } from 'reducers/notification'
import { modalSelectors, openDialog, closeDialog } from 'reducers/modal'
import { setBackupProvider } from 'reducers/backup'

const hideSkipBackupDialog = closeDialog.bind(null, SKIP_BACKUP_DIALOG_ID)
const showSkipBackupDialog = openDialog.bind(null, SKIP_BACKUP_DIALOG_ID)

const mapStateToProps = state => ({
  isSkipBackupDialogOpen: modalSelectors.isDialogOpen(state, SKIP_BACKUP_DIALOG_ID),
})

const mapDispatchToProps = {
  hideSkipBackupDialog,
  showError,
  setBackupProvider,
  showSkipBackupDialog,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BackupSetup)
