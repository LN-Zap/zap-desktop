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
 * pendingBalance - Pending balance.
 *
 * @param {State} state Redux state
 * @returns {string|null} Pending balance
 */
export const pendingBalance = createSelector(channelBalancePending, limboBalance, (cb, lb) => {
  return CoinBig.sum(cb, lb).toString()
})

/**
 * totalBalance - Total balance.
 *
 * @param {State} state Redux state
 * @returns {string|null} Total balance
 */
export const totalBalance = createSelector(
  channelBalance,
  walletBalanceConfirmed,
  walletBalanceUnconfirmed,
  limboBalance,
  (c = '0', wc = '0', wuc = '0', l = '0') => {
    // when a force close channel passes its maturity height the balance from it
    // appears in both unconfirmed wallet balance and in total limbo balance.
    // Here we try to prevent the double counting.
    const dedupedUnconfirmed = CoinBig(wuc).minus(l)
    const unconfirmed = CoinBig.max(0, dedupedUnconfirmed)

    // Total balance is the sum of
    // - channel balances
    // - confirmed wallet balance
    // - deduped unconfirmed wallet balance
    // - limbo balance
    return CoinBig.sum(c, wc, unconfirmed, l).toString()
  }
)

export default {
  channelBalance,
  channelBalanceConfirmed,
  channelBalancePending,
  walletBalance,
  walletBalanceConfirmed,
  walletBalanceUnconfirmed,
  limboBalance,
  pendingBalance,
  totalBalance,
}
