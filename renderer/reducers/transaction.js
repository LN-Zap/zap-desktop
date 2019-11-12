import { createSelector } from 'reselect'
import uniqBy from 'lodash/uniqBy'
import last from 'lodash/last'
import find from 'lodash'
import { showSystemNotification } from '@zap/utils/notifications'
import { convert } from '@zap/utils/btc'
import { getIntl } from '@zap/i18n'
import delay from '@zap/utils/delay'
import genId from '@zap/utils/genId'
import errorToUserFriendly from '@zap/utils/userFriendlyErrors'
import { grpc } from 'workers'
import { addressSelectors, newAddress } from './address'
import { fetchBalance } from './balance'
import { fetchChannels, channelsSelectors, getChannelData } from './channels'
import { settingsSelectors } from './settings'
import createReducer from './utils/createReducer'
import messages from './messages'

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
export const ADD_TRANSACTION = 'ADD_TRANSACTION'

// ------------------------------------
// Helpers
// ------------------------------------

/**
 * decorateTransaction - Decorate transaction object with custom/computed properties.
 *
 * @param  {object} transaction Transaction
 * @returns {object} Decorated transaction
 */
const decorateTransaction = transaction => {
  const decoration = {
    type: 'transaction',
    isReceived: !transaction.isSending && transaction.amount > 0,
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
 * @param  {object} data Transaction data
 * @returns {object} Action
 */
export function sendTransaction(data) {
  const transaction = {
    ...data,
    status: 'sending',
    isSending: true,
    time_stamp: Math.round(new Date() / 1000),
    num_confirmations: 0,
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
 * @returns {Function} Thunk
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
 * @returns {Function} Thunk
 */
export const receiveTransactions = (transactions, updateOnly = false) => (dispatch, getState) => {
  const state = getState()

  const currentAddresses = addressSelectors.currentAddresses(state)
  let usedAddresses = []

  // index of the last tx in `transactions`
  // that is newer(or equal) than the last tx from the state.
  // This is used to only update known transactions or add new if
  // we are in `updateOnly` mode
  let lastKnownTxIndex = 0
  const lastTx = last(transactionsSelector(state))
  transactions.forEach((transaction, index) => {
    const { time_stamp, dest_addresses } = transaction
    if (updateOnly && !lastKnownTxIndex && lastTx && time_stamp >= lastTx.time_stamp) {
      lastKnownTxIndex = index
    }
    // Keep track of used addresses.
    usedAddresses = usedAddresses.concat(dest_addresses)
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

  // fetch new balance
  dispatch(fetchBalance())
}

/**
 * sendCoins - Send an onchain transaction.
 *
 * @param  {object}  options Options
 * @param  {number}  options.value Number of units to send
 * @param  {string}  options.addr Destination address
 * @param  {string}  options.cryptoUnit Crypto unit that value is denominated in (converted to sats prior to send)
 * @param  {number}  options.targetConf Number of blocks to target for conf time
 * @param  {number}  options.satPerByte Sat per byte fee rate to apply
 * @param  {boolean} options.isCoinSweep Boolean indicating whether this is a coin sweep (will send all funds).
 * @returns {Function} Thunk
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
    target_conf: targetConf,
    sat_per_byte: satPerByte,
    send_all: isCoinSweep,
  }
  dispatch(sendTransaction(payload))

  // Submit the transaction to LND.
  try {
    await grpc.services.Lightning.sendCoins(payload)
    dispatch(transactionSuccessful({ ...payload, internalId }))
  } catch (e) {
    dispatch(transactionFailed({ error: e.message, internalId }))
  }
}

/**
 * transactionSuccessful - Success handler for sendCoins.
 *
 * @param  {{ string }} addr Destination address
 * @returns {Function} Thunk
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
 * transactionSuccessful - Error handler for sendCoins.
 *
 * @param  {object} details Details
 * @param  {{ string }} details.addr Destination address
 * @param  {{ string }} details.error Error message
 * @returns {Function} Thunk
 */
export const transactionFailed = ({ internalId, error }) => async (dispatch, getState) => {
  const { timestamp } = find(transactionsSendingSelector(getState(), { internalId }))

  // Ensure payment stays in sending state for at least 2 seconds.
  await delay(2000 - (Date.now() - timestamp * 1000))

  // Mark the payment as failed.
  dispatch({ type: TRANSACTION_FAILED, internalId, error: errorToUserFriendly(error) })
}

/**
 * receiveTransactionData - Listener for when a new transaction is pushed from the subscriber.
 *
 * @param  {object} transaction Transaction
 * @returns {Function} Thunk
 */
export const receiveTransactionData = transaction => (dispatch, getState) => {
  // add the transaction only if we are not already aware of it
  const state = getState()
  if (
    !state.transaction ||
    !state.transaction.transactions ||
    !state.transaction.transactions.find(tx => tx.tx_hash === transaction.tx_hash)
  ) {
    dispatch({ type: ADD_TRANSACTION, transaction })

    // fetch updated channels
    dispatch(fetchChannels())
    const intl = getIntl()
    // HTML 5 desktop notification for the new transaction
    if (transaction.isReceived) {
      showSystemNotification(intl.formatMessage(messages.transaction_received_title), {
        body: intl.formatMessage(messages.transaction_received_body),
      })
      // Generate a new address
      dispatch(newAddress(settingsSelectors.currentConfig(state).address))
    } else {
      showSystemNotification(intl.formatMessage(messages.transaction_sent_title), {
        body: intl.formatMessage(messages.transaction_sent_body),
      })
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
    state.transactions = uniqBy(state.transactions.concat(transactions), 'tx_hash')
  },
  [ADD_TRANSACTION]: (state, { transaction }) => {
    state.transactions.unshift(transaction)
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
          const channelPoint = channelData.channel_point
          return channelPoint ? transaction.tx_hash === channelPoint.split(':')[0] : null
        })
        const closedChannel = allChannelsRaw.find(channelObj => {
          const channelData = getChannelData(channelObj)
          return [channelData.closing_tx_hash, channelObj.closing_txid].includes(
            transaction.tx_hash
          )
        })
        const pendingChannel = [...closingPendingChannelsRaw, ...pendingOpenChannelsRaw].find(
          channelObj => {
            return channelObj.closing_txid === transaction.tx_hash
          }
        )
        return {
          ...transaction,
          closeType: closedChannel ? closedChannel.close_type : null,
          isFunding: Boolean(fundedChannel),
          isClosing: Boolean(closedChannel),
          isPending: Boolean(pendingChannel),
          limboAmount: pendingChannel && pendingChannel.limbo_balance,
          maturityHeight: pendingChannel && pendingChannel.maturity_height,
        }
      })
  }
)

export { transactionsSelectors }

export default createReducer(initialState, ACTION_HANDLERS)
