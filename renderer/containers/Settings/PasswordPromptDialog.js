import { connect } from 'react-redux'
import PasswordPromptDialog from 'components/Settings/Security/PasswordPromptDialog'
import {
  accountSelectors,
  clearLoginError,
  disablePassword as onOk,
  PASSWORD_PROMPT_DIALOG_ID,
} from 'reducers/account'
import { modalSelectors, closeDialog } from 'reducers/modal'

const onCancel = () => closeDialog(PASSWORD_PROMPT_DIALOG_ID)

const mapStateToProps = state => ({
  isOpen: modalSelectors.isDialogOpen(state, PASSWORD_PROMPT_DIALOG_ID),
  loginError: accountSelectors.loginError(state),
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
