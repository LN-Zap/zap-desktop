import { connect } from 'react-redux'
import SettingsPage from 'components/Settings/SettingsPage'
import { settingsSelectors } from 'reducers/settings'
import { tickerSelectors } from 'reducers/ticker'

const mapStateToProps = state => ({
  currentConfig: settingsSelectors.currentConfig(state),
  rateProviderItems: tickerSelectors.rateProviderSelector(state).map(key => ({ key })),
})

export default connect(mapStateToProps)(SettingsPage)
