import { connect } from 'react-redux'

import SettingsPage from 'components/Settings/SettingsPage'
import {
  accountSelectors,
  CHANGE_PASSWORD_DIALOG_ID,
  PASSWORD_PROMPT_DIALOG_ID,
  PASSWORD_SET_DIALOG_ID,
} from 'reducers/account'
import { modalSelectors } from 'reducers/modal'
import { settingsSelectors } from 'reducers/settings'

const mapStateToProps = state => ({
  currentConfig: settingsSelectors.currentConfig(state),
  isLoggedIn: accountSelectors.isLoggedIn(state),
  isChangePasswordDialogOpen: modalSelectors.isDialogOpen(state, CHANGE_PASSWORD_DIALOG_ID),
  isSetPasswordDialogOpen: modalSelectors.isDialogOpen(state, PASSWORD_SET_DIALOG_ID),
  isPromptPasswordDialogOpen: modalSelectors.isDialogOpen(state, PASSWORD_PROMPT_DIALOG_ID),
})

export default connect(mapStateToProps)(SettingsPage)
