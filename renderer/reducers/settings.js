import config from 'config'
import merge from 'lodash/merge'
import set from 'lodash/set'
import { createSelector } from 'reselect'
import difference from '@zap/utils/difference'
import { showError } from './notification'

// ------------------------------------
// Initial State
// ------------------------------------

const initialState = {
  isSettingsLoaded: false,
  initSettingsError: null,
  config: {},
}

// ------------------------------------
// Constants
// ------------------------------------

export const INIT_SETTINGS = 'INIT_SETTINGS'
export const INIT_SETTINGS_SUCCESS = 'INIT_SETTINGS_SUCCESS'
export const INIT_SETTINGS_FAILURE = 'INIT_SETTINGS_FAILURE'

export const SET_SETTING = 'SET_SETTING'
export const UPDATE_CONFIG = 'UPDATE_CONFIG'

// ------------------------------------
// Actions
// ------------------------------------

/**
 * initSettings - Fetch the current settings from the database and save into the store.
 * Should be called once when the app first loads.
 *
 * @returns {Function} Thunk
 */
export const initSettings = () => async dispatch => {
  dispatch({ type: INIT_SETTINGS })
  try {
    const allSettings = await window.db.settings.toArray()
    const settings = allSettings.reduce((obj, item) => {
      obj[item.key] = item.value
      return obj
    }, {})
    dispatch({ type: INIT_SETTINGS_SUCCESS, settings })
  } catch (e) {
    dispatch({ type: INIT_SETTINGS_FAILURE, initSettingsError: e })
    // TODO: i18n compatibility.
    dispatch(showError(`Unable to load settings: ${e.message}`, { timeout: 0 }))
  }
}

/**
 * putSetting - Save an updated setting.
 *
 * @param  {string} key Key
 * @param  {*} value Value
 * @returns {Function} Thunk
 */
export const putSetting = (key, value) => async dispatch => {
  dispatch({ type: SET_SETTING, key, value })
  await window.db.settings.put({ key, value })
}

/**
 * putConfig - Save a config property.
 *
 * @param  {string} path Config path property to set
 * @param  {*} value Value to set
 * @returns {Function} Thunk
 */
export const putConfig = (path, value) => async (dispatch, getState) => {
  const currentConfig = settingsSelectors.currentConfig(getState())
  const updatedConfig = set(Object.assign({}, currentConfig), path, value)
  await dispatch(saveConfigOverrides(updatedConfig))
}

/**
 * saveConfigOverrides - Save config overrides.
 *
 * @param  {object} values Config object that matches the structure of root config.
 * @returns {Function} Thunk
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
  [INIT_SETTINGS]: state => ({ ...state }),
  [INIT_SETTINGS_SUCCESS]: (state, { settings }) => ({
    ...state,
    ...settings,
    isSettingsLoaded: true,
  }),
  [INIT_SETTINGS_FAILURE]: (state, { initSettingsError }) => ({ ...state, initSettingsError }),
  [SET_SETTING]: (state, { key, value }) => ({ ...state, ...{ ...state.settings, [key]: value } }),
}

// ------------------------------------
// Selectors
// ------------------------------------

const isSettingsLoadedSelector = state => state.settings.isSettingsLoaded
const configSelector = state => state.settings.config
const settingsSelectors = {}
settingsSelectors.isSettingsLoaded = isSettingsLoadedSelector
settingsSelectors.currentConfig = createSelector(
  configSelector,
  overrides => merge({}, config, overrides)
)
export { settingsSelectors }

// ------------------------------------
// Reducer
// ------------------------------------

/**
 * settingsReducer - Settings reducer.
 *
 * @param  {object} state = initialState Initial state
 * @param  {object} action Action
 * @returns {object} Final state
 */
export default function settingsReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
