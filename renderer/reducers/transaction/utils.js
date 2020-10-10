import { CoinBig } from '@zap/utils/coin'

/**
 * @typedef {import('./reducer').Transaction} Transaction
 */

/**
 * @typedef {object} Decoration Transaction decorated with additional useful properties.
 * @property {'transaction'} type Activity type
 * @property {boolean} isReceived Boolean indicating if transaction is incoming
 * @property {boolean} isSent Boolean indicating if transaction is outgoing
 * @property {boolean} isToSelf Boolean indicating if transaction is a self payment
 * /
 
/**
 * @typedef {Transaction & Decoration} DecoratedTransaction
 */

/**
 * decorateTransaction - Decorate transaction object with custom/computed properties.
 *
 * @param {Transaction} transaction Transaction
 * @returns {DecoratedTransaction} Decorated transaction
 */
export const decorateTransaction = transaction => {
  const isReceived = !transaction.isSending && CoinBig(transaction.amount).gt(0)
  const isSent = !transaction.isSending && CoinBig(transaction.amount).lt(0)
  const isToSelf = isSent && CoinBig.sum(transaction.totalFees, transaction.amount).isEqualTo(0)

  /** @type {DecoratedTransaction} */
  return {
    ...transaction,
    type: 'transaction',
    isReceived,
    isSent,
    isToSelf,
  }
}
