import { ipcRenderer } from 'electron'
import { showNotification } from 'lib/utils/notifications'
import { convert } from 'lib/utils/btc'
import errorToUserFriendly from 'lib/utils/userFriendlyErrors'
import { newAddress } from './address'
import { fetchBalance } from './balance'
import { setFormType } from './form'
import { fetchChannels } from './channels'
import { changeFilter } from './activity'

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

// Decorate transaction object with custom/computed properties.
const decorateTransaction = transaction => {
  transaction.type = 'transaction'
  transaction.received = transaction.amount > 0
  return transaction
}

const delay = time => new Promise(resolve => setTimeout(() => resolve(), time))

// ------------------------------------
// Actions
// ------------------------------------
export function getTransactions() {
  return {
    type: GET_TRANSACTIONS
  }
}

export function sendTransaction(data) {
  const transaction = Object.assign({}, data, {
    status: 'sending',
    timestamp: Math.round(new Date() / 1000)
  })
  return {
    type: SEND_TRANSACTION,
    transaction
  }
}

// Send IPC event for payments
export const fetchTransactions = () => dispatch => {
  dispatch(getTransactions())
  ipcRenderer.send('lnd', { msg: 'transactions' })
}

// Receive IPC event for payments
export const receiveTransactions = (event, { transactions }) => (dispatch, getState) => {
  const state = getState()

  const currentAddress = state.address.address
  let usedAddresses = []

  // Decorate transactions with additional metadata.
  transactions.forEach(transaction => {
    decorateTransaction(transaction)
    // If our current wallet address has been used, generate a new one.
    usedAddresses = usedAddresses.concat(transaction.dest_addresses)
  })

  dispatch({ type: RECEIVE_TRANSACTIONS, transactions })

  if (usedAddresses.includes(currentAddress)) {
    dispatch(newAddress('np2wkh'))
  }
  // fetch new balance
  dispatch(fetchBalance())
}

export const sendCoins = ({ value, addr, currency, targetConf, satPerByte }) => dispatch => {
  // backend needs amount in satoshis no matter what currency we are using
  const amount = convert(currency, 'sats', value)

  // submit the transaction to LND
  const data = { amount, addr, target_conf: targetConf, sat_per_byte: satPerByte }
  ipcRenderer.send('lnd', {
    msg: 'sendCoins',
    data
  })
  dispatch(sendTransaction(data))

  // Close the form modal once the transaction has been sent
  dispatch(changeFilter({ key: 'ALL_ACTIVITY', name: 'all' }))
  dispatch(setFormType(null))
}

// Receive IPC event for successful payment.
export const transactionSuccessful = (event, { addr }) => async (dispatch, getState) => {
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
export const transactionFailed = (event, { addr, error }) => async (dispatch, getState) => {
  const state = getState()
  const { timestamp } = state.transaction.transactionsSending.find(t => t.addr === addr)

  // Ensure payment stays in sending state for at least 2 seconds.
  await delay(2000 - (Date.now() - timestamp * 1000))

  // Mark the payment as failed.
  dispatch({ type: TRANSACTION_FAILED, addr, error: errorToUserFriendly(error) })
}

// Listener for when a new transaction is pushed from the subscriber
export const newTransaction = (event, { transaction }) => (dispatch, getState) => {
  // add the transaction only if we are not already aware of it
  const state = getState()
  if (
    !state.transaction ||
    !state.transaction.transactions ||
    !state.transaction.transactions.find(tx => tx.tx_hash === transaction.tx_hash)
  ) {
    decorateTransaction(transaction)

    dispatch({ type: ADD_TRANSACTION, transaction })

    // Refetch transactions.
    dispatch(fetchTransactions())

    // fetch updated channels
    dispatch(fetchChannels())

    // HTML 5 desktop notification for the new transaction
    if (transaction.received) {
      showNotification(
        'On-chain Transaction Received!',
        "Lucky you, you just received a new on-chain transaction. I'm jealous."
      )
      dispatch(newAddress('np2wkh')) // Generate a new address
    } else {
      showNotification(
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
    transactionsSending: [...state.transactionsSending, transaction]
  }),
  [RECEIVE_TRANSACTIONS]: (state, { transactions }) => ({
    ...state,
    transactionLoading: false,
    transactions
  }),
  [ADD_TRANSACTION]: (state, { transaction }) => ({
    ...state,
    transactions: [transaction, ...state.transactions]
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
          status: 'successful'
        }
      })
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
          error
        }
      })
    }
  },
  [TRANSACTION_COMPLETE]: (state, { addr }) => {
    return {
      ...state,
      transactionsSending: state.transactionsSending.filter(item => item.addr !== addr)
    }
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  transactionLoading: false,
  transactions: [],
  transactionsSending: []
}

export default function transactionReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
