import { connect } from 'react-redux'
import SettingsPage from 'components/Settings/SettingsPage'
import { settingsSelectors } from 'reducers/settings'
import { accountSelectors } from 'reducers/account'

const mapStateToProps = state => ({
  currentConfig: settingsSelectors.currentConfig(state),
  isLoggedIn: accountSelectors.isLoggedIn(state),
})

export default connect(mapStateToProps)(SettingsPage)
