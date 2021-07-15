import { updateIntl } from 'react-intl-redux'
import { send } from 'redux-electron-ipc'

import { setIntlLocale } from '@zap/i18n'
import translations from '@zap/i18n/translation'
import createReducer from '@zap/utils/createReducer'
import { putConfig, settingsSelectors } from 'reducers/settings'

import localeSelectors from './selectors'

/**
 * setLocale - Set the current locale.
 *
 * @param {string} locale Locale
 * @returns {(dispatch:Function, getState:Function) => Promise<void>} Thunk
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

/**
 * initLocale - Initialise the translation system.
 *
 * @returns {(dispatch:Function, getState:Function) => Promise<void>} Thunk
 */
export const initLocale = () => async (dispatch, getState) => {
  const state = getState()
  const currentConfig = settingsSelectors.currentConfig(state)
  const currentLocale = localeSelectors.currentLocale(state)

  if (currentConfig.locale !== currentLocale) {
    await dispatch(setLocale(currentConfig.locale))
  }
}

export default createReducer(translations)
