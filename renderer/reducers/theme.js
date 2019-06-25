import { createSelector } from 'reselect'
import { dark, light } from 'themes'
import { putConfig, settingsSelectors } from './settings'

// ------------------------------------
// Initial State
// ------------------------------------

const initialState = {
  themes: { dark, light },
}

// ------------------------------------
// Constants
// ------------------------------------

export const SET_THEME = 'SET_THEME'

// ------------------------------------
// Actions
// ------------------------------------

export const initTheme = () => async (dispatch, getState) => {
  const state = getState()
  const currentConfig = settingsSelectors.currentConfig(state)
  const currentTheme = themeSelectors.currentTheme(state)

  if (currentConfig.theme !== currentTheme) {
    await dispatch(setTheme(currentConfig.theme))
  }
}

export const setTheme = currentTheme => async dispatch => {
  // Persist the new theme in the store.
  dispatch({ type: SET_THEME, currentTheme })

  // Persist the new theme setting.
  await dispatch(putConfig('theme', currentTheme))
}

// ------------------------------------
// Action Handlers
// ------------------------------------

const ACTION_HANDLERS = {
  [SET_THEME]: state => ({ ...state }),
}

// ------------------------------------
// Selectors
// ------------------------------------

const themeSelectors = {}
const currentThemeSelector = state => settingsSelectors.currentConfig(state).theme
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

/**
 * themeReducer - Theme reducer.
 *
 * @param  {object} state = initialState Initial state
 * @param  {object} action Action
 * @returns {object} Final state
 */
export default function themeReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
