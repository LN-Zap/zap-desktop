import { createSelector } from 'reselect'
import { dark, light } from 'themes'
import db from 'store/db'

// ------------------------------------
// Constants
// ------------------------------------

export const SET_THEME = 'SET_THEME'
const DEFAULT_THEME = 'dark'

// ------------------------------------
// Actions
// ------------------------------------

export const initTheme = () => async (dispatch, getState) => {
  let theme
  try {
    const userTheme = await db.settings.get({ key: 'theme' })
    theme = userTheme.value || DEFAULT_THEME
  } catch (e) {
    theme = DEFAULT_THEME
  }

  const state = getState()
  const currentTheme = themeSelectors.currentTheme(state)

  if (currentTheme !== theme) {
    dispatch(setTheme(theme))
  }
}

export function setTheme(currentTheme) {
  // Persist the new fiatTicker in our ticker store
  db.settings.put({ key: 'theme', value: currentTheme })

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

themeSelectors.themes = createSelector(
  themesSelector,
  themes => themes
)
themeSelectors.currentTheme = createSelector(
  currentThemeSelector,
  currentTheme => currentTheme
)
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
  currentTheme: null,
  themes: { dark, light }
}

export default function themeReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
