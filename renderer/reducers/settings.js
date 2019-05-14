import config from 'config'
import merge from 'lodash.merge'
import { createSelector } from 'reselect'
import set from 'lodash.set'
import difference from '@zap/utils/difference'

// ------------------------------------
// Constants
// ------------------------------------

export const SET_SETTINGS = 'SET_SETTINGS'
export const SET_SETTING = 'SET_SETTING'
export const UPDATE_CONFIG = 'UPDATE_CONFIG'

// ------------------------------------
// Actions
// ------------------------------------

/**
 * Fetch the current settings from the database and save into the store.
 */
export const initSettings = () => async dispatch => {
  const settings = await window.db.settings.toArray()
  dispatch({ type: SET_SETTINGS, settings })
}

/**
 * Save an updated setting.
 * @param  {string} key Key
 * @param  {*} value Value
 */
export const putSetting = (key, value) => async dispatch => {
  dispatch({ type: SET_SETTING, key, value })
  await window.db.settings.put({ key, value })
}

/**
 * Save a config property.
 * @param  {string} path Config path property to set
 * @param  {*} value Value to set
 */
export const putConfig = (path, value) => async (dispatch, getState) => {
  const currentConfig = settingsSelectors.currentConfig(getState())
  const updatedConfig = set(Object.assign({}, currentConfig), path, value)
  await dispatch(saveConfigOverrides(updatedConfig))
}

/**
 * Save config overrides.
 * @param  {Object} values Config object that matches the structure of root config.
 */
export const saveConfigOverrides = values => async (dispatch, getState) => {
  const currentConfig = settingsSelectors.currentConfig(getState())
  const updatedConfig = merge({}, currentConfig, values)
  const overrides = difference(updatedConfig, config)
  await dispatch(putSetting('config', overrides))
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
// Selectors
// ------------------------------------

const configSelector = state => state.settings.config
const settingsSelectors = {}
settingsSelectors.currentConfig = createSelector(
  configSelector,
  overrides => merge({}, config, overrides)
)
export { settingsSelectors }

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  config: {},
}

export default function settingsReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
