import { createSelector } from 'reselect'
import { CoinBig } from '@zap/utils/coin'

/**
 * channelBalance - Channel balance.
 *
 * @param  {object} state redux state
 * @returns {string} Channel balance
 */
export const channelBalance = state => state.balance.channelBalance

/**
 * channelBalanceConfirmed - Confirmed channel balance.
 *
 * @param  {object} state redux state
 * @returns {string} Confirmed channel balance
 */
export const channelBalanceConfirmed = state => state.balance.channelBalanceConfirmed

/**
 * channelBalancePending - Pending channel balance.
 *
 * @param  {object} state redux state
 * @returns {string} Pending channel balance
 */
export const channelBalancePending = state => state.balance.channelBalancePending

/**
 * walletBalance - Total wallet balance.
 *
 * @param  {object} state redux state
 * @returns {string} Total wallet balance
 */
export const walletBalance = state => state.balance.walletBalance

/**
 * walletBalanceConfirmed - Confirmed wallet balance.
 *
 * @param  {object} state redux state
 * @returns {string} Confirmed wallet balance
 */
export const walletBalanceConfirmed = state => state.balance.walletBalanceConfirmed

/**
 * walletBalanceUnconfirmed - Unconfirmed wallet balance.
 *
 * @param  {object} state redux state
 * @returns {string} Unconfirmed wallet balance
 */
export const walletBalanceUnconfirmed = state => state.balance.walletBalanceUnconfirmed

/**
 * limboBalance - Limbo balance.
 *
 * @param  {object} state redux state
 * @returns {string} Limbo balance
 */
export const limboBalance = state => state.channels.pendingChannels.totalLimboBalance

/**
 * totalBalance - Total balance
 *
 * @param  {object} state redux state
 * @returns {string} Total balance
 */
export const totalBalance = createSelector(
  channelBalance,
  walletBalance,
  limboBalance,
  (c = 0, w = 0, l = 0) => CoinBig.sum(c, w, l).toString()
)

export default {
  channelBalance,
  channelBalanceConfirmed,
  channelBalancePending,
  walletBalance,
  walletBalanceConfirmed,
  walletBalanceUnconfirmed,
  limboBalance,
  totalBalance,
}
