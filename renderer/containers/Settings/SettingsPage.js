import { connect } from 'react-redux'
import SettingsPage from 'components/Settings/SettingsPage'
import { settingsSelectors } from 'reducers/settings'
import { tickerSelectors, fetchTickers } from 'reducers/ticker'

const mapStateToProps = state => ({
  currentConfig: settingsSelectors.currentConfig(state),
  rateProviderItems: tickerSelectors.rateProviderSelector(state).map(key => ({ key })),
})

const mapDispatchToProps = {
  fetchTickers,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsPage)
