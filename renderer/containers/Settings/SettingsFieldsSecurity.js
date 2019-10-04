import { connect } from 'react-redux'
import SettingsFieldsSecurity from 'components/Settings/SettingsFieldsSecurity'
import { openDialog } from 'reducers/modal'
import {
  CHANGE_PASSWORD_DIALOG_ID,
  PASSWORD_PROMPT_DIALOG_ID,
  PASSWORD_SET_DIALOG_ID,
} from 'reducers/account'

const changePassword = () => openDialog(CHANGE_PASSWORD_DIALOG_ID)
const disablePassword = () => openDialog(PASSWORD_PROMPT_DIALOG_ID)
const enablePassword = () => openDialog(PASSWORD_SET_DIALOG_ID)

const mapDispatchToProps = {
  changePassword,
  enablePassword,
  disablePassword,
}

export default connect(
  null,
  mapDispatchToProps
)(SettingsFieldsSecurity)
