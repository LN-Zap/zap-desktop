import { send } from 'redux-electron-ipc'
import { updateIntl } from 'react-intl-redux'
import translations from '@zap/i18n/translation'
import { setFiatTicker, tickerSelectors } from './ticker'
import { putConfig, settingsSelectors } from './settings'

// ------------------------------------
// Actions
// ------------------------------------

export const setLocale = locale => async (dispatch, getState) => {
  const state = getState()

  // Switch the active locale.
  dispatch(
    updateIntl({
      locale,
      messages: state.locale[locale],
    })
  )

  // Save the new locale setting.
  await dispatch(putConfig('locale', locale))

  // Let the main process know the locale has changed.
  dispatch(send('setLocale', locale))
}

export const receiveLocale = (event, locale) => dispatch => {
  dispatch(setLocale(locale))
}

export const initLocale = () => async (dispatch, getState) => {
  const state = getState()
  const currentConfig = settingsSelectors.currentConfig(state)
  const currentLocale = localeSelectors.currentLocale(state)

  if (currentConfig.locale !== currentLocale) {
    await dispatch(setLocale(currentConfig.locale))
  }
}

export const initCurrency = () => async (dispatch, getState) => {
  const state = getState()
  const currentConfig = settingsSelectors.currentConfig(state)
  const currentCurrency = tickerSelectors.fiatTicker(state)

  if (currentConfig.currency !== currentCurrency) {
    await dispatch(setFiatTicker(currentConfig.currency))
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
