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
 * lnurlAuthParams - Current lnurl channel params.
 *
 * @param {State} state Redux state
 * @returns {{service: string, secret: string}|null} Current lnurl auth paramaters
 */
const lnurlChannelParams = state => state.lnurl.lnurlChannelParams

/**
 * willShowLnurlAuthPrompt - Boolean indicating wether lnurl auth prompt should show.
 */
const willShowLnurlAuthPrompt = createSelector(lnurlAuthParams, params => {
  return Boolean(params)
})

/**
 * willShowLnurlChannelPrompt - Boolean indicating wether lnurl channel prompt should show.
 */
const willShowLnurlChannelPrompt = createSelector(lnurlChannelParams, params => {
  return Boolean(params)
})

export default {
  lnurlAuthParams,
  lnurlChannelParams,
  willShowLnurlAuthPrompt,
  willShowLnurlChannelPrompt,
}
