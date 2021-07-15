import { connect } from 'react-redux'

import ChangePasswordDialog from 'components/Settings/Security/ChangePasswordDialog'
import {
  changePassword as onChange,
  accountSelectors,
  clearLoginError,
  CHANGE_PASSWORD_DIALOG_ID,
} from 'reducers/account'
import { closeDialog } from 'reducers/modal'

const onCancel = () => closeDialog(CHANGE_PASSWORD_DIALOG_ID)

const mapStateToProps = state => ({
  loginError: accountSelectors.loginError(state),
})

const mapDispatchToProps = {
  onChange,
  onCancel,
  clearLoginError,
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangePasswordDialog)
