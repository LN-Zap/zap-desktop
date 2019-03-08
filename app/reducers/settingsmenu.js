// ------------------------------------
// Constants
// ------------------------------------
export const OPEN_SETTINGS = 'OPEN_SETTINGS'
export const CLOSE_SETTINGS = 'CLOSE_SETTINGS'
export const SET_ACTIVE_SUBMENU = 'SET_ACTIVE_SUBMENU'
export const DISABLE_SUBMENU = 'DISABLE_SUBMENU'

// ------------------------------------
// Actions
// ------------------------------------
export function openSettings() {
  return {
    type: OPEN_SETTINGS,
  }
}

export function closeSettings() {
  return {
    type: CLOSE_SETTINGS,
  }
}

export function setActiveSubMenu(activeSubMenu) {
  return {
    type: SET_ACTIVE_SUBMENU,
    activeSubMenu,
  }
}

export function disableSubMenu() {
  return {
    type: DISABLE_SUBMENU,
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [OPEN_SETTINGS]: state => ({ ...state, isSettingsOpen: true }),
  [CLOSE_SETTINGS]: state => ({ ...state, isSettingsOpen: false, activeSubMenu: null }),
  [SET_ACTIVE_SUBMENU]: (state, { activeSubMenu }) => ({ ...state, activeSubMenu }),
  [DISABLE_SUBMENU]: state => ({ ...state, activeSubMenu: null }),
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  isSettingsOpen: false,
  activeSubMenu: null,
}

export default function settingsReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
