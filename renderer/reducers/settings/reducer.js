import config from 'config'
import merge from 'lodash/merge'
import set from 'lodash/set'

import { getIntl } from '@zap/i18n'
import createReducer from '@zap/utils/createReducer'
import difference from '@zap/utils/difference'
import { showError } from 'reducers/notification'

import * as constants from './constants'
import messages from './messages'
import settingsSelectors from './selectors'

const { INIT_SETTINGS, INIT_SETTINGS_SUCCESS, INIT_SETTINGS_FAILURE, SET_SETTING } = constants

/**
 * @typedef State
 * @property {boolean} isSettingsLoaded Boolean indicating if settings have been loaded
 * @property {string|null} initSettingsError Settings load error message
 * @property {object} config Current config
 */

// ------------------------------------
// Initial State
// ------------------------------------

/** @type {State} */
const initialState = {
  isSettingsLoaded: false,
  initSettingsError: null,
  config: {},
}

// ------------------------------------
// Actions
// ------------------------------------

/**
 * initSettings - Fetch the current settings from the database and save into the store.
 * Should be called once when the app first loads.
 *
 * @returns {(dispatch:Function) => Promise<void>} Thunk
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
 * @param {string} key Key
 * @param {*} value Value
 * @returns {(dispatch:Function) => Promise<void>} Thunk
 */
export const putSetting = (key, value) => async dispatch => {
  dispatch({ type: SET_SETTING, key, value })
  await window.db.settings.put({ key, value })
}

/**
 * saveConfigOverrides - Save config overrides.
 *
 * @param {object} values Config object that matches the structure of root config.
 * @returns {(dispatch:Function, getState:Function) => Promise<void>} Thunk
 */
export const saveConfigOverrides = values => async (dispatch, getState) => {
  const currentConfig = settingsSelectors.currentConfig(getState())
  const updatedConfig = merge({}, currentConfig, values)
  const overrides = difference(updatedConfig, config)
  await dispatch(putSetting('config', overrides))
}

/**
 * putConfig - Save a config property.
 *
 * @param {string} path Config path property to set
 * @param {*} value Value to set
 * @returns {(dispatch:Function, getState:Function) => Promise<void>} Thunk
 */
export const putConfig = (path, value) => async (dispatch, getState) => {
  const currentConfig = settingsSelectors.currentConfig(getState())
  const updatedConfig = set({ ...currentConfig }, path, value)
  await dispatch(saveConfigOverrides(updatedConfig))
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

export default createReducer(initialState, ACTION_HANDLERS)
