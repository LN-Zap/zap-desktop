import { createSelector } from 'reselect'

import { channelsSelectors, getChannelData } from 'reducers/channels'

import { decorateTransaction } from './utils'

const transactionsSelector = state => state.transaction.transactions

const transactionsSendingSelector = state => state.transaction.transactionsSending

const transactions = createSelector(
  transactionsSelector,
  channelsSelectors.allChannelsRaw,
  channelsSelectors.closingPendingChannelsRaw,
  channelsSelectors.pendingOpenChannelsRaw,
  (allTransactions, allChannelsRaw, closingPendingChannelsRaw, pendingOpenChannelsRaw) => {
    return allTransactions
      .map(transaction => decorateTransaction(transaction))
      .map(transaction => {
        const fundedChannel = allChannelsRaw.find(channelObj => {
          const channelData = getChannelData(channelObj)
          const { channelPoint } = channelData
          return channelPoint ? transaction.txHash === channelPoint.split(':')[0] : null
        })
        const closedChannel = allChannelsRaw.find(channelObj => {
          const channelData = getChannelData(channelObj)
          return [channelData.closingTxHash, channelObj.closingTxid].includes(transaction.txHash)
        })
        const pendingChannel = [...closingPendingChannelsRaw, ...pendingOpenChannelsRaw].find(
          channelObj => {
            return channelObj.closingTxid === transaction.txHash
          }
        )
        return {
          ...transaction,
          closeType: closedChannel ? closedChannel.closeType : null,
          isFunding: Boolean(fundedChannel),
          isClosing: Boolean(closedChannel),
          isPending: Boolean(pendingChannel),
          limboAmount: pendingChannel && pendingChannel.limboBalance,
          maturityHeight: pendingChannel && pendingChannel.maturityHeight,
        }
      })
  }
)

const transactionsSending = createSelector(transactionsSendingSelector, ts =>
  ts.map(transaction => decorateTransaction(transaction))
)

export default {
  transactions,
  transactionsSending,
}
