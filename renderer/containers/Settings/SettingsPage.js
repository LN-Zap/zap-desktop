import { connect } from 'react-redux'
import SettingsPage from 'components/Settings/SettingsPage'
import { settingsSelectors } from 'reducers/settings'

const mapStateToProps = state => ({
  currentConfig: settingsSelectors.currentConfig(state),
})

export default connect(mapStateToProps)(SettingsPage)
