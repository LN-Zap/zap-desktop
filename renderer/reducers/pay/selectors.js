import { createSelector } from 'reselect'
import { settingsSelectors } from 'reducers/settings'

const getLnurlWithdrawParams = state => state.pay.lnurlWithdrawParams

/**
 * willShowLnurlWithdrawPrompt - Boolean indicating wether lnurl withdeawal prompt should show.
 */
export const willShowLnurlWithdrawPrompt = createSelector(
  getLnurlWithdrawParams,
  settingsSelectors.currentConfig,
  (params, config) => {
    const promptEnabled = config.lnurl.requirePrompt
    return Boolean(promptEnabled && params)
  }
)

/**
 * lnurlWithdrawParams - Current lnurl withdrawal paramaters.
 */
export const lnurlWithdrawParams = createSelector(getLnurlWithdrawParams, params => params)

export default {
  willShowLnurlWithdrawPrompt,
  lnurlWithdrawParams,
}
