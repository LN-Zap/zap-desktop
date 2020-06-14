import config from 'config'
import merge from 'lodash/merge'
import { createSelector } from 'reselect'

const configSelector = state => state.settings.config

const isSettingsLoaded = state => state.settings.isSettingsLoaded

const currentConfig = createSelector(configSelector, overrides => merge({}, config, overrides))

export default { isSettingsLoaded, currentConfig }
