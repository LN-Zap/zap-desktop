import { createSelector } from 'reselect'
import { CoinBig } from '@zap/utils/coin'

/**
 * @typedef {import('../index').State} State
 */

/**
 * channelBalance - Channel balance.
 *
 * @param {State} state Redux state
 * @returns {string|null} Channel balance
 */
export const channelBalance = state => state.balance.channelBalance

/**
 * channelBalanceConfirmed - Confirmed channel balance.
 *
 * @param {State} state Redux state
 * @returns {string|null} Confirmed channel balance
 */
export const channelBalanceConfirmed = state => state.balance.channelBalanceConfirmed

/**
 * channelBalancePending - Pending channel balance.
 *
 * @param {State} state Redux state
 * @returns {string|null} Pending channel balance
 */
export const channelBalancePending = state => state.balance.channelBalancePending

/**
 * walletBalance - Total wallet balance.
 *
 * @param {State} state Redux state
 * @returns {string|null} Total wallet balance
 */
export const walletBalance = state => state.balance.walletBalance

/**
 * walletBalanceConfirmed - Confirmed wallet balance.
 *
 * @param {State} state Redux state
 * @returns {string|null} Confirmed wallet balance
 */
export const walletBalanceConfirmed = state => state.balance.walletBalanceConfirmed

/**
 * walletBalanceUnconfirmed - Unconfirmed wallet balance.
 *
 * @param {State} state Redux state
 * @returns {string|null} Unconfirmed wallet balance
 */
export const walletBalanceUnconfirmed = state => state.balance.walletBalanceUnconfirmed

/**
 * limboBalance - Limbo balance.
 *
 * @param {State} state Redux state
 * @returns {string|null} Limbo balance
 */
export const limboBalance = state => state.channels.pendingChannels.totalLimboBalance

/**
 * totalBalance - Total balance.
 *
 * @param {State} state Redux state
 * @returns {string|null} Total balance
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
