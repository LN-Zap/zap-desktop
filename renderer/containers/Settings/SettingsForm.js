import { connect } from 'react-redux'

import SettingsForm from 'components/Settings/SettingsForm'
import { configureAutoUpdater } from 'reducers/autoupdate'
import { setLocale } from 'reducers/locale'
import { showNotification, showError } from 'reducers/notification'
import { saveConfigOverrides } from 'reducers/settings'
import { fetchTickers } from 'reducers/ticker'

const mapDispatchToProps = {
  configureAutoUpdater,
  saveConfigOverrides,
  showNotification,
  showError,
  setLocale,
  fetchTickers,
}

export default connect(null, mapDispatchToProps)(SettingsForm)
