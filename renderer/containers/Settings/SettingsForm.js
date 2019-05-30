import { connect } from 'react-redux'
import SettingsForm from 'components/Settings/SettingsForm'
import { saveConfigOverrides } from 'reducers/settings'
import { showNotification, showError } from 'reducers/notification'
import { setLocale } from 'reducers/locale'
import { configureAutoUpdater } from 'reducers/autoupdate'

const mapDispatchToProps = {
  configureAutoUpdater,
  saveConfigOverrides,
  showNotification,
  showError,
  setLocale,
}

export default connect(
  null,
  mapDispatchToProps
)(SettingsForm)
