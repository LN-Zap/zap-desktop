import { send } from 'redux-electron-ipc'
import { updateIntl } from 'react-intl-redux'
import translations from '@zap/i18n/translation'
import { setIntlLocale } from '@zap/i18n'
import { putConfig, settingsSelectors } from './settings'

// ------------------------------------
// IPC
// ------------------------------------

/**
 * receiveLocale - Receive locate to set from the main process.
 *
 * @param {object} event Event
 * @param {string} locale Locale
 * @returns {Function} Thunk
 */
export const receiveLocale = (event, locale) => dispatch => {
  dispatch(setLocale(locale))
}

// ------------------------------------
// Actions
// ------------------------------------

/**
 * initLocale - Initialise the translation system.
 *
 * @returns {Function} Thunk
 */
export const initLocale = () => async (dispatch, getState) => {
  const state = getState()
  const currentConfig = settingsSelectors.currentConfig(state)
  const currentLocale = localeSelectors.currentLocale(state)

  if (currentConfig.locale !== currentLocale) {
    await dispatch(setLocale(currentConfig.locale))
  }
}

/**
 * setLocale - Set the current locale.
 *
 * @param {string} locale Locale
 * @returns {Function} Thunk
 */
export const setLocale = locale => async (dispatch, getState) => {
  const state = getState()

  // Switch the active locale.
  dispatch(
    updateIntl({
      locale,
      messages: state.locale[locale],
    })
  )
  setIntlLocale(locale)
  // Save the new locale setting.
  await dispatch(putConfig('locale', locale))

  // Let the main process know the locale has changed.
  dispatch(send('setLocale', locale))
}

// ------------------------------------
// Selectors
// ------------------------------------

export const localeSelectors = {
  currentLocale: state => state.intl.locale,
}

// ------------------------------------
// Reducer
// ------------------------------------

/**
 * localeReducer - Locale reducer.
 *
 * @param  {object} state = initialState Initial state
 * @returns {object} Next state
 */
export default function localeReducer(state = translations) {
  return state
}
