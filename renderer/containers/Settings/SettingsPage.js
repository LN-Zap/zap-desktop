import { connect } from 'react-redux'
import map from 'lodash/map'

import SettingsPage from 'components/Settings/SettingsPage'
import { settingsSelectors } from 'reducers/settings'
import { tickerSelectors } from 'reducers/ticker'

const getRateProviders = state => {
  const providers = tickerSelectors.rateProviderSelector(state)
  // pluck key and name from config
  return map(providers, ({ id, name }) => ({ key: id, value: name }))
}

const mapStateToProps = state => ({
  currentConfig: settingsSelectors.currentConfig(state),
  rateProviderItems: getRateProviders(state),
})

export default connect(mapStateToProps)(SettingsPage)
