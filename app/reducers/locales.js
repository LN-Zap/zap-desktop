import { updateIntl } from 'react-intl-redux'
import { ipcRenderer } from 'electron'
import { translationMessages } from '../i18n'

// ------------------------------------
// Actions
// ------------------------------------

export const setLocale = locale => (dispatch, getState) => {
  const state = getState()

  dispatch(
    updateIntl({
      locale,
      messages: state.locales[locale]
    })
  )
  ipcRenderer.send('setLocale', locale)
}

export const receiveLocale = (event, locale) => dispatch => {
  dispatch(setLocale(locale))
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = translationMessages

export default function localesReducer(state = initialState) {
  return state
}
