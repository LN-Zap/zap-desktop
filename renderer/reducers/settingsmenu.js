import createReducer from './utils/createReducer'

// ------------------------------------
// Initial State
// ------------------------------------

const initialState = {
  isSettingsMenuOpen: false,
  activeSubMenu: null,
}

// ------------------------------------
// Constants
// ------------------------------------
export const OPEN_SETTINGS = 'OPEN_SETTINGS'
export const CLOSE_SETTINGS = 'CLOSE_SETTINGS'

// ------------------------------------
// Actions
// ------------------------------------

/**
 * openSettingsMenu - Open the settings menu.
 *
 * @returns {object} Action
 */
export function openSettingsMenu() {
  return {
    type: OPEN_SETTINGS,
  }
}

/**
 * closeSettingsMenu - Close the settings menu.
 *
 * @returns {object} Action
 */
export function closeSettingsMenu() {
  return {
    type: CLOSE_SETTINGS,
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------

const ACTION_HANDLERS = {
  [OPEN_SETTINGS]: state => {
    state.isSettingsMenuOpen = true
  },
  [CLOSE_SETTINGS]: state => {
    state.isSettingsMenuOpen = false
    state.activeSubMenu = null
  },
}

export default createReducer(initialState, ACTION_HANDLERS)
