import { connect } from 'react-redux'
import Settings from 'components/Settings'
import { saveConfigOverrides, settingsSelectors } from 'reducers/settings'
import { showNotification } from 'reducers/notification'
import { setLocale } from 'reducers/locale'

const mapStateToProps = state => ({
  currentConfig: settingsSelectors.currentConfig(state),
})

const mapDispatchToProps = {
  saveConfigOverrides,
  showNotification,
  setLocale,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings)
