import { createSelector } from 'reselect'

import { settingsSelectors } from 'reducers/settings'

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
 * lnurlChannelParams - Current lnurl channel params.
 *
 * @param {State} state Redux state
 * @returns {{service: string, secret: string}|null} Current lnurl auth paramaters
 */
const lnurlChannelParams = state => state.lnurl.lnurlChannelParams

/**
 * lnurlWithdrawParams - Current lnurl channel params.
 *
 * @param {State} state Redux state
 * @returns {{service: string, amount: string, memo: string}|null} Current lnurl auth paramaters
 */
const lnurlWithdrawParams = state => state.lnurl.lnurlWithdrawParams

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

/**
 * willShowLnurlWithdrawPrompt - Boolean indicating wether lnurl withdraw prompt should show.
 */
export const willShowLnurlWithdrawPrompt = createSelector(
  lnurlWithdrawParams,
  settingsSelectors.currentConfig,
  (params, config) => {
    const promptEnabled = config.lnurl.requirePrompt
    return Boolean(promptEnabled && params)
  }
)

export default {
  lnurlAuthParams,
  lnurlChannelParams,
  lnurlWithdrawParams,
  willShowLnurlAuthPrompt,
  willShowLnurlChannelPrompt,
  willShowLnurlWithdrawPrompt,
}
