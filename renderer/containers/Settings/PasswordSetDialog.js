import { connect } from 'react-redux'

import SetPasswordDialog from 'components/Settings/Security/SetPasswordDialog'
import { enablePassword as onOk, PASSWORD_SET_DIALOG_ID, clearLoginError } from 'reducers/account'
import { closeDialog } from 'reducers/modal'

const onCancel = () => closeDialog(PASSWORD_SET_DIALOG_ID)

const mapDispatchToProps = {
  onOk,
  onCancel,
  clearLoginError,
}

export default connect(null, mapDispatchToProps)(SetPasswordDialog)
