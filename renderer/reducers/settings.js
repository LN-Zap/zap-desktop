import config from 'config'
import merge from 'lodash/merge'
import set from 'lodash/set'
import { createSelector } from 'reselect'
import difference from '@zap/utils/difference'
import { getIntl } from '@zap/i18n'
import { showError } from './notification'
import createReducer from './utils/createReducer'
import messages from './messages'
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
    dispatch({ type: INIT_SETTINGS_FAILURE, error: e.message })
    dispatch(
      showError(getIntl().formatMessage(messages.settings_init_error, { error: e.message }), {
        timeout: 0,
      })
    )
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
  [INIT_SETTINGS]: () => {}, // noop
  [INIT_SETTINGS_SUCCESS]: (state, { settings }) => ({
    ...state,
    ...settings,
    isSettingsLoaded: true,
  }),
  [INIT_SETTINGS_FAILURE]: (state, { error }) => {
    state.initSettingsError = error
  },
  [SET_SETTING]: (state, { key, value }) => {
    state[key] = value
  },
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

export default createReducer(initialState, ACTION_HANDLERS)
