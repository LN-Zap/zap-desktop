import { createSelector } from 'reselect'
import Store from 'electron-store'
import { dark, light } from 'themes'

// Settings store
const store = new Store({ name: 'settings' })

// ------------------------------------
// Constants
// ------------------------------------

export const SET_THEME = 'SET_THEME'
const DEFAULT_THEME = 'dark'

// ------------------------------------
// Actions
// ------------------------------------

export function setTheme(currentTheme) {
  // Persist the new fiatTicker in our ticker store
  store.set('theme', currentTheme)

  return {
    type: SET_THEME,
    currentTheme
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SET_THEME]: (state, { currentTheme }) => ({ ...state, currentTheme })
}

// ------------------------------------
// Selectors
// ------------------------------------

const themeSelectors = {}
const currentThemeSelector = state => state.theme.currentTheme
const themesSelector = state => state.theme.themes

themeSelectors.themes = createSelector(themesSelector, themes => themes)
themeSelectors.currentTheme = createSelector(currentThemeSelector, currentTheme => currentTheme)
themeSelectors.currentThemeSettings = createSelector(
  themesSelector,
  currentThemeSelector,
  (themes, currentTheme) => themes[currentTheme]
)

export { themeSelectors }

// ------------------------------------
// Reducer
// ------------------------------------

const initialState = {
  currentTheme: store.get('theme', DEFAULT_THEME),
  themes: { dark, light }
}

export default function themeReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
