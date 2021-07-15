import { connect } from 'react-redux'

import SettingsFieldsSecurity from 'components/Settings/SettingsFieldsSecurity'
import {
  CHANGE_PASSWORD_DIALOG_ID,
  PASSWORD_PROMPT_DIALOG_ID,
  PASSWORD_SET_DIALOG_ID,
  accountSelectors,
} from 'reducers/account'
import { openDialog } from 'reducers/modal'
import { settingsSelectors } from 'reducers/settings'

const changePassword = () => openDialog(CHANGE_PASSWORD_DIALOG_ID)
const disablePassword = () => openDialog(PASSWORD_PROMPT_DIALOG_ID)
const enablePassword = () => openDialog(PASSWORD_SET_DIALOG_ID)

const mapStateToProps = state => ({
  isAccountPasswordEnabled: accountSelectors.isAccountPasswordEnabled(state),
  currentConfig: settingsSelectors.currentConfig(state),
})

const mapDispatchToProps = {
  changePassword,
  enablePassword,
  disablePassword,
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsFieldsSecurity)
