import Store from 'electron-store'
import { updateIntl } from 'react-intl-redux'
import { ipcRenderer } from 'electron'
import translations from 'lib/i18n/translation'

// Settings store
const store = new Store({ name: 'settings' })

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
  store.set('locale', locale)

  // Let the main process know the locale has changed.
  ipcRenderer.send('setLocale', locale)
}

export const receiveLocale = (event, locale) => dispatch => {
  dispatch(setLocale(locale))
}

// ------------------------------------
// Reducer
// ------------------------------------
export default function localeReducer(state = translations) {
  return state
}
