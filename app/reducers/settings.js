import Store from 'electron-store'

// Settings store
const store = new Store({ name: 'settings' })
// ------------------------------------
// Constants
// ------------------------------------
export const SET_SETTINGS_OPEN = 'SET_SETTINGS_OPEN'
export const SET_ACTIVE_SUBMENU = 'SET_ACTIVE_SUBMENU'
export const DISABLE_SUBMENU = 'DISABLE_SUBMENU'

export const SET_THEME = 'SET_THEME'

// ------------------------------------
// Actions
// ------------------------------------
export function setSettingsOpen(settingsOpen) {
  return {
    type: SET_SETTINGS_OPEN,
    settingsOpen
  }
}

export function setActiveSubMenu(activeSubMenu) {
  return {
    type: SET_ACTIVE_SUBMENU,
    activeSubMenu
  }
}

export function disableSubMenu() {
  return {
    type: DISABLE_SUBMENU
  }
}

export function setTheme(theme) {
  // Persist the new fiatTicker in our ticker store
  store.set('theme', theme)

  return {
    type: SET_THEME,
    theme
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SET_SETTINGS_OPEN]: (state, { settingsOpen }) => ({ ...state, settingsOpen }),
  [SET_ACTIVE_SUBMENU]: (state, { activeSubMenu }) => ({ ...state, activeSubMenu }),
  [DISABLE_SUBMENU]: state => ({ ...state, activeSubMenu: null }),

  [SET_THEME]: (state, { theme }) => ({ ...state, theme })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  settingsOpen: false,
  activeSubMenu: null,
  theme: store.get('theme', 'dark')
}

export default function settingsReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
