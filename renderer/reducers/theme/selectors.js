import { createSelector } from 'reselect'
import { settingsSelectors } from 'reducers/settings'

const currentThemeSelector = state => settingsSelectors.currentConfig(state).theme
const themesSelector = state => state.theme.themes

const themes = createSelector(themesSelector, themes => themes)

const currentTheme = createSelector(currentThemeSelector, currentTheme => currentTheme)

const currentThemeSettings = createSelector(
  themesSelector,
  currentThemeSelector,
  (themes, currentTheme) => themes[currentTheme]
)

export default {
  themes,
  currentTheme,
  currentThemeSettings,
}
