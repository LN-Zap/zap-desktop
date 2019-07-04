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
  [OPEN_SETTINGS]: state => ({ ...state, isSettingsMenuOpen: true }),
  [CLOSE_SETTINGS]: state => ({ ...state, isSettingsMenuOpen: false, activeSubMenu: null }),
}

// ------------------------------------
// Reducer
// ------------------------------------

/**
 * settingsmenuReducer - Settingsmenu reducer.
 *
 * @param  {object} state = initialState Initial state
 * @param  {object} action Action
 * @returns {object} Next state
 */
export default function settingsmenuReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
