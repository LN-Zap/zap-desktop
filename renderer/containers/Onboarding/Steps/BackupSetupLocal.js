import { connect } from 'react-redux'

import { BackupSetupLocal } from 'components/Onboarding/Steps'
import { setBackupPathLocal } from 'reducers/backup'

const mapDispatchToProps = {
  setBackupPathLocal,
}

export default connect(null, mapDispatchToProps)(BackupSetupLocal)
