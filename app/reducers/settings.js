// ------------------------------------
// Constants
// ------------------------------------
export const OPEN_SETTINGS = 'OPEN_SETTINGS'
export const CLOSE_SETTINGS = 'CLOSE_SETTINGS'
export const SET_ACTIVE_SUBMENU = 'SET_ACTIVE_SUBMENU'
export const DISABLE_SUBMENU = 'DISABLE_SUBMENU'
export const SET_SETTINGS = 'SET_SETTINGS'
export const SET_SETTING = 'SET_SETTING'

// ------------------------------------
// Actions
// ------------------------------------
export function openSettings() {
  return {
    type: OPEN_SETTINGS
  }
}

export function closeSettings() {
  return {
    type: CLOSE_SETTINGS
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

export function setSettings(settings) {
  return {
    type: SET_SETTINGS,
    settings
  }
}

export function setSetting(key, value) {
  return {
    type: SET_SETTING,
    key,
    value
  }
}

export const initSettings = () => async dispatch => {
  // Fetch the current settings from the database.
  const settings = await window.db.settings.toArray()

  // Save settings into the store.
  dispatch(setSettings(settings))
}

export const putSetting = (key, value) => async dispatch => {
  // Save the updasted setting in the store.
  dispatch(setSetting(key, value))

  // Save the updated setting in the database.
  await window.db.settings.put({ key, value })
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [OPEN_SETTINGS]: state => ({ ...state, isSettingsOpen: true }),
  [CLOSE_SETTINGS]: state => ({ ...state, isSettingsOpen: false, activeSubMenu: null }),
  [SET_ACTIVE_SUBMENU]: (state, { activeSubMenu }) => ({ ...state, activeSubMenu }),
  [DISABLE_SUBMENU]: state => ({ ...state, activeSubMenu: null }),
  [SET_SETTINGS]: (state, { settings }) => ({
    ...state,
    ...settings.reduce((obj, item) => {
      obj[item.key] = item.value
      return obj
    }, {})
  }),
  [SET_SETTING]: (state, { key, value }) => ({
    ...state,
    ...{ ...state.settings, [key]: value }
  })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  isSettingsOpen: false,
  activeSubMenu: null
}

export default function settingsReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
