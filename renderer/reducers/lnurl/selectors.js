import { createSelector } from 'reselect'

/**
 * @typedef {import('../index').State} State
 */

/**
 * lnurlAuthParams - Current lnurl auth params.
 *
 * @param {State} state Redux state
 * @returns {{service: string, secret: string}|null} Current lnurl auth paramaters
 */
const lnurlAuthParams = state => state.lnurl.lnurlAuthParams

/**
 * willShowLnurlAuthPrompt - Boolean indicating wether lnurl auth prompt should show.
 */
const willShowLnurlAuthPrompt = createSelector(lnurlAuthParams, params => {
  return Boolean(params)
})

export default {
  lnurlAuthParams,
  willShowLnurlAuthPrompt,
}
