import { setLocale } from './reducer'

/**
 * receiveLocale - Receive locate to set from the main process.
 *
 * @param {object} event Event
 * @param {string} locale Locale
 * @returns {(dispatch:Function) => void} Thunk
 */
export const receiveLocale = (event, locale) => dispatch => {
  dispatch(setLocale(locale))
}
