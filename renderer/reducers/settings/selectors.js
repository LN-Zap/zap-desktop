import config from 'config'
import merge from 'lodash/merge'
import { createSelector } from 'reselect'

/**
 * @typedef {import('../index').State} State
 */

/**
 * configOverrides - Config overrides.
 *
 * @param {State} state Redux state
 * @returns {object} Config overrides
 */
const configOverrides = state => state.settings.config

/**
 * configOverrides - Config overrides.
 *
 * @param {State} state Redux state
 * @returns {boolean} Boolean indicating wether settings have been loaded
 */
const isSettingsLoaded = state => state.settings.isSettingsLoaded

/**
 * configOverrides - Current config (user config merged with default config).
 */
const currentConfig = createSelector(configOverrides, overrides => merge({}, config, overrides))

export default {
  isSettingsLoaded,
  currentConfig,
}
