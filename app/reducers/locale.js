import { send } from 'redux-electron-ipc'
import { updateIntl } from 'react-intl-redux'
import translations from 'lib/i18n/translation'
import db from 'store/db'
import { setFiatTicker } from './ticker'

// ------------------------------------
// Actions
// ------------------------------------

export const setLocale = locale => (dispatch, getState) => {
  const state = getState()

  // Switch the active locale.
  dispatch(
    updateIntl({
      locale,
      messages: state.locale[locale]
    })
  )

  // Save the new locale sa our language preference.
  db.settings.put({ key: 'locale', value: locale })

  // Let the main process know the locale has changed.
  dispatch(send('setLocale', locale))
}

export const receiveLocale = (event, locale) => dispatch => {
  dispatch(setLocale(locale))
}

export const initLocale = () => async (dispatch, getState) => {
  const userLocale = await db.settings.get({ key: 'locale' })
  const state = getState()
  const currentLocale = localeSelectors.currentLocale(state)

  if (userLocale && userLocale.value) {
    const locale = userLocale.value
    if (currentLocale !== locale) {
      dispatch(setLocale(locale))
    }
  }
}

export const initCurrency = () => async dispatch => {
  const userCurrency = await db.settings.get({ key: 'fiatTicker' })
  if (userCurrency && userCurrency.value) {
    dispatch(setFiatTicker(userCurrency.value))
  }
}

export const localeSelectors = {
  currentLocale: state => state.intl.locale
}

// ------------------------------------
// Reducer
// ------------------------------------
export default function localeReducer(state = translations) {
  return state
}
