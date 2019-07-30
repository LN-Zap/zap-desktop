import { connect } from 'react-redux'
import { BackupSetup } from 'components/Onboarding/Steps'
import { hideSkipBackupDialog, showSkipBackupDialog } from 'reducers/onboarding'
import { showError } from 'reducers/notification'
import { setBackupProvider } from 'reducers/backup'

const mapStateToProps = state => ({
  isSkipBackupDialogOpen: state.onboarding.isSkipBackupDialogOpen,
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
