// ------------------------------------
// Constants
// ------------------------------------
export const SET_SETTINGS = 'SET_SETTINGS'
export const SET_SETTING = 'SET_SETTING'

// ------------------------------------
// Actions
// ------------------------------------
export function setSettings(settings) {
  return {
    type: SET_SETTINGS,
    settings,
  }
}

export function setSetting(key, value) {
  return {
    type: SET_SETTING,
    key,
    value,
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
  [SET_SETTINGS]: (state, { settings }) => ({
    ...state,
    ...settings.reduce((obj, item) => {
      obj[item.key] = item.value
      return obj
    }, {}),
  }),
  [SET_SETTING]: (state, { key, value }) => ({
    ...state,
    ...{ ...state.settings, [key]: value },
  }),
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  settings: {},
}

export default function settingsReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
