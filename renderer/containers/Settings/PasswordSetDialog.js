import { connect } from 'react-redux'
import PasswordPromptDialog from 'components/Settings/Security/PasswordPromptDialog'
import { enablePassword as onOk, PASSWORD_SET_DIALOG_ID } from 'reducers/account'
import { modalSelectors, closeDialog } from 'reducers/modal'

const onCancel = () => closeDialog(PASSWORD_SET_DIALOG_ID)

const mapStateToProps = state => ({
  isOpen: modalSelectors.isDialogOpen(state, PASSWORD_SET_DIALOG_ID),
  isPromptMode: false,
})

const mapDispatchToProps = {
  onOk,
  onCancel,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PasswordPromptDialog)
