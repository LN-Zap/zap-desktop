import { createSelector } from 'reselect'
import { showSystemNotification } from '@zap/utils/notifications'
import { convert } from '@zap/utils/btc'
import delay from '@zap/utils/delay'
import errorToUserFriendly from '@zap/utils/userFriendlyErrors'
import { grpcService } from 'workers'
import { addressSelectors, newAddress } from './address'
import { fetchBalance } from './balance'
import { fetchChannels, channelsSelectors, getChannelData } from './channels'
import { settingsSelectors } from './settings'

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
    received: transaction.amount > 0,
  }
  return {
    ...transaction,
    ...decoration,
  }
}

// ------------------------------------
// Actions
// ------------------------------------
export function getTransactions() {
  return {
    type: GET_TRANSACTIONS,
  }
}

export function sendTransaction(data) {
  const transaction = {
    ...data,
    status: 'sending',
    isSending: true,
    time_stamp: Math.round(new Date() / 1000),
  }
  return {
    type: SEND_TRANSACTION,
    transaction,
  }
}

// Send IPC event for payments
export const fetchTransactions = () => async dispatch => {
  dispatch(getTransactions())
  const grpc = await grpcService
  const transactions = await grpc.services.Lightning.getTransactions()
  dispatch(receiveTransactions(transactions))
}

// Receive IPC event for payments
export const receiveTransactions = ({ transactions }) => (dispatch, getState) => {
  const state = getState()

  const currentAddresses = addressSelectors.currentAddresses(state)
  let usedAddresses = []

  // Keep track of used addresses.
  transactions.forEach(transaction => {
    usedAddresses = usedAddresses.concat(transaction.dest_addresses)
  })

  dispatch({ type: RECEIVE_TRANSACTIONS, transactions })

  // If our current wallet address has been used, generate a new one.
  Object.entries(currentAddresses).forEach(([type, address]) => {
    if (usedAddresses.includes(address)) {
      dispatch(newAddress(type))
    }
  })

  // fetch new balance
  dispatch(fetchBalance())
}

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

  // Add to sendingPayments in the state.
  const payload = {
    amount: isCoinSweep ? null : amount,
    addr,
    target_conf: targetConf,
    sat_per_byte: satPerByte,
    send_all: isCoinSweep,
  }
  dispatch(sendTransaction(payload))

  // Submit the transaction to LND.
  try {
    const grpc = await grpcService
    const { txid } = await grpc.services.Lightning.sendCoins(payload)
    dispatch(transactionSuccessful({ ...payload, txid }))
  } catch (e) {
    dispatch(
      transactionFailed({
        error: e.message,
        addr: payload.addr,
      })
    )
  }
}

// Receive IPC event for successful payment.
export const transactionSuccessful = ({ addr }) => async (dispatch, getState) => {
  const state = getState()
  const { timestamp } = state.transaction.transactionsSending.find(t => t.addr === addr)

  // Ensure payment stays in sending state for at least 2 seconds.
  await delay(2000 - (Date.now() - timestamp * 1000))

  // Mark the payment as successful.
  dispatch({ type: TRANSACTION_SUCCESSFUL, addr })

  // Wait for another second.
  await delay(1000)

  // Mark the payment as successful.
  dispatch({ type: TRANSACTION_COMPLETE, addr })
}

// Receive IPC event for failed payment.
export const transactionFailed = ({ addr, error }) => async (dispatch, getState) => {
  const state = getState()
  const { timestamp } = state.transaction.transactionsSending.find(t => t.addr === addr)

  // Ensure payment stays in sending state for at least 2 seconds.
  await delay(2000 - (Date.now() - timestamp * 1000))

  // Mark the payment as failed.
  dispatch({ type: TRANSACTION_FAILED, addr, error: errorToUserFriendly(error) })
}

// Listener for when a new transaction is pushed from the subscriber
export const receiveTransactionData = transaction => (dispatch, getState) => {
  // add the transaction only if we are not already aware of it
  const state = getState()
  if (
    !state.transaction ||
    !state.transaction.transactions ||
    !state.transaction.transactions.find(tx => tx.tx_hash === transaction.tx_hash)
  ) {
    dispatch({ type: ADD_TRANSACTION, transaction })

    // Refetch transactions.
    dispatch(fetchTransactions())

    // fetch updated channels
    dispatch(fetchChannels())

    // HTML 5 desktop notification for the new transaction
    if (transaction.received) {
      showSystemNotification(
        'On-chain Transaction Received!',
        "Lucky you, you just received a new on-chain transaction. I'm jealous."
      )
      dispatch(newAddress(settingsSelectors.currentConfig(state).address)) // Generate a new address
    } else {
      showSystemNotification(
        'On-chain Transaction Sent!',
        "Hate to see 'em go but love to watch 'em leave. Your on-chain transaction successfully sent."
      )
    }
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [GET_TRANSACTIONS]: state => ({ ...state, transactionLoading: true }),
  [SEND_TRANSACTION]: (state, { transaction }) => ({
    ...state,
    transactionsSending: [...state.transactionsSending, transaction],
  }),
  [RECEIVE_TRANSACTIONS]: (state, { transactions }) => ({
    ...state,
    transactionLoading: false,
    transactions,
  }),
  [ADD_TRANSACTION]: (state, { transaction }) => ({
    ...state,
    transactions: [transaction, ...state.transactions],
  }),
  [TRANSACTION_SUCCESSFUL]: (state, { addr }) => {
    return {
      ...state,
      transactionsSending: state.transactionsSending.map(item => {
        if (item.addr !== addr) {
          return item
        }
        return {
          ...item,
          status: 'successful',
        }
      }),
    }
  },
  [TRANSACTION_FAILED]: (state, { addr, error }) => {
    return {
      ...state,
      transactionsSending: state.transactionsSending.map(item => {
        if (item.addr !== addr) {
          return item
        }
        return {
          ...item,
          status: 'failed',
          error,
        }
      }),
    }
  },
  [TRANSACTION_COMPLETE]: (state, { addr }) => {
    return {
      ...state,
      transactionsSending: state.transactionsSending.filter(item => item.addr !== addr),
    }
  },
}

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

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  transactionLoading: false,
  transactions: [],
  transactionsSending: [],
}

export default function transactionReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
