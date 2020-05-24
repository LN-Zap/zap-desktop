import { createSelector } from 'reselect'
import uniqBy from 'lodash/uniqBy'
import uniq from 'lodash/uniq'
import last from 'lodash/last'
import find from 'lodash/find'
import createReducer from '@zap/utils/createReducer'
import { showSystemNotification } from '@zap/utils/notifications'
import { convert } from '@zap/utils/btc'
import { CoinBig } from '@zap/utils/coin'
import { getIntl } from '@zap/i18n'
import delay from '@zap/utils/delay'
import genId from '@zap/utils/genId'
import errorToUserFriendly from '@zap/utils/userFriendlyErrors'
import { grpc } from 'workers'
import { addressSelectors, newAddress } from './address'
import { fetchBalance } from './balance'
import { fetchChannels, channelsSelectors, getChannelData } from './channels'
import messages from './messages'

let usedAddresses = []

// ------------------------------------
// Initial State
// ------------------------------------

const initialState = {
  transactionLoading: false,
  transactions: [],
  transactionsSending: [],
}

// ------------------------------------
// Constants
// ------------------------------------

export const GET_TRANSACTIONS = 'GET_TRANSACTIONS'
export const RECEIVE_TRANSACTIONS = 'RECEIVE_TRANSACTIONS'
export const SEND_TRANSACTION = 'SEND_TRANSACTION'
export const TRANSACTION_SUCCESSFUL = 'TRANSACTION_SUCCESSFUL'
export const TRANSACTION_FAILED = 'TRANSACTION_FAILED'
export const TRANSACTION_COMPLETE = 'TRANSACTION_COMPLETE'

// ------------------------------------
// Helpers
// ------------------------------------

/**
 * decorateTransaction - Decorate transaction object with custom/computed properties.
 *
 * @param {object} transaction Transaction
 * @returns {object} Decorated transaction
 */
const decorateTransaction = transaction => {
  const isReceived = !transaction.isSending && CoinBig(transaction.amount).gt(0)
  const isSent = !transaction.isSending && CoinBig(transaction.amount).lt(0)
  const isToSelf = isSent && CoinBig.sum(transaction.totalFees, transaction.amount).isEqualTo(0)
  const decoration = {
    type: 'transaction',
    isReceived,
    isSent,
    isToSelf,
  }
  return {
    ...transaction,
    ...decoration,
  }
}

// ------------------------------------
// Actions
// ------------------------------------

/**
 * sendTransaction - Store details of sending in progress onchain transaction.
 *
 * @param {object} data Transaction data
 * @returns {object} Action
 */
export function sendTransaction(data) {
  const transaction = {
    ...data,
    status: 'sending',
    isSending: true,
    timeStamp: Math.round(new Date() / 1000),
    numConfirmations: 0,
  }
  return {
    type: SEND_TRANSACTION,
    transaction,
  }
}

/**
 * fetchTransactions - Fetch details of all transactions.
 *
 * @param {boolean} updateOnly if true only update known transactions or adds new ones
 * (ones whose timestamp is greater than the newest known one)
 * @returns {(dispatch:Function) => Promise<void>} Thunk
 */
export const fetchTransactions = updateOnly => async dispatch => {
  dispatch({ type: GET_TRANSACTIONS })
  const transactions = await grpc.services.Lightning.getTransactions()
  dispatch(receiveTransactions(transactions.transactions, updateOnly))
}

/**
 * receiveTransactions - Success callback for fetch transactions.
 *
 * @param {Array} transactions of transaction.
 * @param {boolean} updateOnly if true only update known transactions or adds new ones
 * (ones whose timestamp is greater than the newest known one)
 * @returns {(dispatch:Function, getState:Function) => void} Thunk
 */
export const receiveTransactions = (transactions, updateOnly = false) => async (
  dispatch,
  getState
) => {
  const state = getState()

  const currentAddresses = addressSelectors.currentAddresses(state)

  // index of the last tx in `transactions`
  // that is newer(or equal) than the last tx from the state.
  // This is used to only update known transactions or add new if
  // we are in `updateOnly` mode
  let lastKnownTxIndex = 0
  const lastTx = last(transactionsSelector(state))
  transactions.forEach((transaction, index) => {
    const { timeStamp, destAddresses } = transaction
    if (updateOnly && !lastKnownTxIndex && lastTx && timeStamp >= lastTx.timeStamp) {
      lastKnownTxIndex = index
    }
    // Keep track of used addresses.
    usedAddresses = uniq(usedAddresses.concat(destAddresses))
  })

  dispatch({
    type: RECEIVE_TRANSACTIONS,
    transactions: lastKnownTxIndex ? transactions.slice(lastKnownTxIndex) : transactions,
  })

  // If our current wallet address has been used, generate a new one.
  Object.entries(currentAddresses).forEach(([type, address]) => {
    if (usedAddresses.includes(address)) {
      dispatch(newAddress(type))
    }
  })
}

/**
 * sendCoins - Send an onchain transaction.
 *
 * @param {object}  options Options
 * @param {number}  options.value Number of units to send
 * @param {string}  options.addr Destination address
 * @param {string}  options.cryptoUnit Crypto unit that value is denominated in (converted to sats prior to send)
 * @param {number}  options.targetConf Number of blocks to target for conf time
 * @param {number}  options.satPerByte Sat per byte fee rate to apply
 * @param {boolean} options.isCoinSweep Boolean indicating whether this is a coin sweep (will send all funds).
 * @returns {(dispatch:Function) => Promise<void>} Thunk
 */
export const sendCoins = ({
  value,
  addr,
  cryptoUnit,
  targetConf,
  satPerByte,
  isCoinSweep,
}) => async dispatch => {
  // backend needs amount in satoshis no matter what currency we are using
  const amount = convert(cryptoUnit, 'sats', value)

  // Generate a unique id for the transaction attempt.
  const internalId = genId()

  // Add to sendingPayments in the state.
  const payload = {
    internalId,
    addr,
    amount: isCoinSweep ? null : amount,
    targetConf,
    satPerByte,
    sendAll: isCoinSweep,
  }
  dispatch(sendTransaction(payload))

  // Submit the transaction to LND.
  try {
    await grpc.services.Lightning.sendCoins(payload)
    dispatch(transactionSuccessful({ ...payload, internalId }))
  } catch (e) {
    e.message = errorToUserFriendly(e.message)
    dispatch(transactionFailed({ internalId, error: e }))
  }
}

/**
 * transactionSuccessful - Success handler for sendCoins.
 *
 * @param {{ string }} internalId transaction internal id
 * @returns {(dispatch:Function, getState:Function) => Promise<void>} Thunk
 */
export const transactionSuccessful = ({ internalId }) => async (dispatch, getState) => {
  const { timestamp } = find(transactionsSendingSelector(getState(), { internalId }))

  // Ensure payment stays in sending state for at least 2 seconds.
  await delay(2000 - (Date.now() - timestamp * 1000))

  // Mark the payment as successful.
  dispatch({ type: TRANSACTION_SUCCESSFUL, internalId })

  // Wait for another second.
  await delay(1000)

  // Mark the payment as successful.
  dispatch({ type: TRANSACTION_COMPLETE, internalId })
}

/**
 * transactionFailed - Error handler for sendCoins.
 *
 * @param {object} details Details
 * @param {{ string }} details.internalId transaction internal id
 * @param {{ string }} details.error Error message
 * @returns {(dispatch:Function, getState:Function) => Promise<void>} Thunk
 */
export const transactionFailed = ({ internalId, error }) => async (dispatch, getState) => {
  const { timestamp } = find(transactionsSendingSelector(getState(), { internalId }))

  // Ensure payment stays in sending state for at least 2 seconds.
  await delay(2000 - (Date.now() - timestamp * 1000))

  // Mark the payment as failed.
  dispatch({ type: TRANSACTION_FAILED, internalId, error })
}

/**
 * receiveTransactionData - Listener for when a new transaction is pushed from the subscriber.
 *
 * @param {object} transaction Transaction
 * @returns {(dispatch:Function, getState:Function) => void} Thunk
 */
export const receiveTransactionData = transaction => async (dispatch, getState) => {
  const isNew = !transactionsSelector(getState()).find(tx => tx.txHash === transaction.txHash)

  // Add/Update the transaction.
  await dispatch(receiveTransactions([transaction]))

  // Fetch updated channels and balance.
  await dispatch(fetchBalance())
  await dispatch(fetchChannels())

  const intl = getIntl()
  const decoratedTransaction = decorateTransaction(transaction)
  const { isSent, isReceived } = decoratedTransaction

  if (isNew) {
    // Send HTML 5 desktop notification for newly received transactions.
    if (isReceived) {
      showSystemNotification(intl.formatMessage(messages.transaction_received_title), {
        body: intl.formatMessage(messages.transaction_received_body),
      })
    }
    // Send HTML 5 desktop notification for newly sent transactions.
    // (excluding channel opening or channel closing transactions)
    else if (isSent) {
      const poc = channelsSelectors.pendingOpenChannelsRaw(getState())
      const isChannelOpen = poc.some(
        c => c.channel.channelPoint.split(':')[0] === transaction.txHash
      )
      if (!isChannelOpen) {
        showSystemNotification(intl.formatMessage(messages.transaction_sent_title), {
          body: intl.formatMessage(messages.transaction_sent_body),
        })
      }
    }
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------

const ACTION_HANDLERS = {
  [GET_TRANSACTIONS]: state => {
    state.transactionLoading = true
  },
  [SEND_TRANSACTION]: (state, { transaction }) => {
    state.transactionsSending.push(transaction)
  },
  [RECEIVE_TRANSACTIONS]: (state, { transactions }) => {
    state.transactionLoading = false
    state.transactions = uniqBy(transactions.concat(state.transactions), 'txHash')
  },
  [TRANSACTION_SUCCESSFUL]: (state, { internalId }) => {
    const txIndex = state.transactionsSending.findIndex(item => item.internalId === internalId)
    if (txIndex >= 0) {
      state.transactionsSending[txIndex].status = 'successful'
    }
  },
  [TRANSACTION_FAILED]: (state, { internalId, error }) => {
    const txIndex = state.transactionsSending.findIndex(item => item.internalId === internalId)
    if (txIndex >= 0) {
      state.transactionsSending[txIndex].status = 'failed'
      state.transactionsSending[txIndex].error = error
    }
  },
  [TRANSACTION_COMPLETE]: (state, { internalId }) => {
    state.transactionsSending = state.transactionsSending.filter(
      item => item.internalId !== internalId
    )
  },
}

// ------------------------------------
// Selectors
// ------------------------------------

const transactionsSelectors = {}
const transactionsSelector = state => state.transaction.transactions
const transactionsSendingSelector = state => state.transaction.transactionsSending

transactionsSelectors.transactionsSending = createSelector(
  transactionsSendingSelector,
  transactionsSending => transactionsSending.map(transaction => decorateTransaction(transaction))
)

transactionsSelectors.transactions = createSelector(
  transactionsSelector,
  channelsSelectors.allChannelsRaw,
  channelsSelectors.closingPendingChannelsRaw,
  channelsSelectors.pendingOpenChannelsRaw,
  (transactions, allChannelsRaw, closingPendingChannelsRaw, pendingOpenChannelsRaw) => {
    return transactions
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

export { transactionsSelectors }

export default createReducer(initialState, ACTION_HANDLERS)
