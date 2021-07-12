import { createSelector } from 'reselect'

import { settingsSelectors } from 'reducers/settings'

/**
 * @typedef {import('../index').State} State
 */

/**
 * currentTheme - Current theme.
 *
 * @param {State} state Redux state
 * @returns {string|null} Current theme name
 */
const currentTheme = state => settingsSelectors.currentConfig(state).theme

/**
 * themes - All theme.
 *
 * @param {State} state Redux state
 * @returns {string|null} All theme names
 */
const themes = state => state.theme.themes

/**
 * currentThemeSettings - Current theme settings.
 */
const currentThemeSettings = createSelector(
  themes,
  currentTheme,
  (allThemes, item) => allThemes[item]
)

export default {
  themes,
  currentTheme,
  currentThemeSettings,
}
