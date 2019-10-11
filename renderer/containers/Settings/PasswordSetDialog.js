import { connect } from 'react-redux'
import PasswordPromptDialog from 'components/Settings/Security/PasswordPromptDialog'
import { enablePassword as onOk, PASSWORD_SET_DIALOG_ID, clearLoginError } from 'reducers/account'
import { closeDialog } from 'reducers/modal'

const onCancel = () => closeDialog(PASSWORD_SET_DIALOG_ID)

const mapStateToProps = () => ({
  isPromptMode: false,
})

const mapDispatchToProps = {
  onOk,
  onCancel,
  clearLoginError,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PasswordPromptDialog)
