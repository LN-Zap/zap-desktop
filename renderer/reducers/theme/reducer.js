import createReducer from '@zap/utils/createReducer'
import { putConfig, settingsSelectors } from 'reducers/settings'
import { dark, light } from 'themes'

import * as constants from './constants'
import themeSelectors from './selectors'

const { SET_THEME } = constants

// ------------------------------------
// Initial State
// ------------------------------------

/**
 * @typedef State
 * @property {object.<string, any>} themes Themes.
 */

/** @type {State} */
const initialState = {
  themes: { dark, light },
}

// ------------------------------------
// Actions
// ------------------------------------

/**
 * setTheme - Sey the currently active theme.
 *
 * @param {string} currentTheme Theme name
 * @returns {(dispatch:Function) => Promise<void>} Thunk
 */
export const setTheme = currentTheme => async dispatch => {
  // Persist the new theme in the store.
  dispatch({ type: SET_THEME, currentTheme })

  // Persist the new theme setting.
  await dispatch(putConfig('theme', currentTheme))
}

/**
 * initTheme - Initialise the theme system with the currently active theme.
 *
 * @returns {(dispatch:Function, getState:Function) => Promise<void>} Thunk
 */
export const initTheme = () => async (dispatch, getState) => {
  const state = getState()
  const currentConfig = settingsSelectors.currentConfig(state)
  const currentTheme = themeSelectors.currentTheme(state)

  if (currentConfig.theme !== currentTheme) {
    await dispatch(setTheme(currentConfig.theme))
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------

const ACTION_HANDLERS = {
  [SET_THEME]: () => {}, // noop
}

export default createReducer(initialState, ACTION_HANDLERS)
