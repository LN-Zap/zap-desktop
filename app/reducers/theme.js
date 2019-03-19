import { createSelector } from 'reselect'
import { dark, light } from 'themes'
import { putSetting } from './settings'

// ------------------------------------
// Constants
// ------------------------------------

export const SET_THEME = 'SET_THEME'
const DEFAULT_THEME = 'dark'

// ------------------------------------
// Actions
// ------------------------------------

export const initTheme = () => async (dispatch, getState) => {
  const state = getState()
  const userTheme = state.settings.theme || DEFAULT_THEME
  const currentTheme = themeSelectors.currentTheme(state)

  if (userTheme !== currentTheme) {
    dispatch(setTheme(userTheme))
  }
}

export const setTheme = currentTheme => async dispatch => {
  // Persist the new theme in the store.
  dispatch({
    type: SET_THEME,
    currentTheme,
  })

  // Persist the new theme setting.
  await dispatch(putSetting('theme', currentTheme))
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SET_THEME]: (state, { currentTheme }) => ({ ...state, currentTheme }),
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
  themes: { dark, light },
}

export default function themeReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
