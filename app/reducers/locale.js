import { send } from 'redux-electron-ipc'
import { updateIntl } from 'react-intl-redux'
import translations from 'lib/i18n/translation'
import { setFiatTicker } from './ticker'
import { putSetting } from './settings'

// ------------------------------------
// Actions
// ------------------------------------

export const setLocale = locale => (dispatch, getState) => {
  const state = getState()

  // Switch the active locale.
  dispatch(
    updateIntl({
      locale,
      messages: state.locale[locale],
    })
  )

  // Save the new locale setting.
  dispatch(putSetting('locale', locale))

  // Let the main process know the locale has changed.
  dispatch(send('setLocale', locale))
}

export const receiveLocale = (event, locale) => dispatch => {
  dispatch(setLocale(locale))
}

export const initLocale = () => async (dispatch, getState) => {
  const state = getState()
  const userLocale = state.settings.locale
  const currentLocale = localeSelectors.currentLocale(state)

  if (userLocale && userLocale !== currentLocale) {
    dispatch(setLocale(userLocale))
  }
}

export const initCurrency = () => async (dispatch, getState) => {
  const state = getState()
  const userCurrency = state.settings.fiatTicker
  if (userCurrency) {
    dispatch(setFiatTicker(userCurrency))
  }
}

export const localeSelectors = {
  currentLocale: state => state.intl.locale,
}

// ------------------------------------
// Reducer
// ------------------------------------
export default function localeReducer(state = translations) {
  return state
}
