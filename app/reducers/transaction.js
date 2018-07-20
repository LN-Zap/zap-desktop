import { ipcRenderer } from 'electron'
import { showNotification } from '../notifications'
import { btc } from '../utils'
import { newAddress } from './address'
import { fetchBalance } from './balance'
import { setFormType } from './form'
import { resetPayForm } from './payform'
import { setError } from './error'

// ------------------------------------
// Constants
// ------------------------------------
export const GET_TRANSACTIONS = 'GET_TRANSACTIONS'
export const RECEIVE_TRANSACTIONS = 'RECEIVE_TRANSACTIONS'

export const SEND_TRANSACTION = 'SEND_TRANSACTION'

export const TRANSACTION_SUCCESSFULL = 'TRANSACTION_SUCCESSFULL'
export const TRANSACTION_FAILED = 'TRANSACTION_FAILED'

export const ADD_TRANSACTION = 'ADD_TRANSACTION'

export const SHOW_SUCCESS_TRANSACTION_SCREEN = 'SHOW_SUCCESS_TRANSACTION_SCREEN'
export const HIDE_SUCCESS_TRANSACTION_SCREEN = 'HIDE_SUCCESS_TRANSACTION_SCREEN'

// ------------------------------------
// Helpers
// ------------------------------------

// Decorate transaction object with custom/computed properties.
const decorateTransaction = transaction => {
  transaction.received = transaction.amount > 0
  return transaction
}

// ------------------------------------
// Actions
// ------------------------------------
export function getTransactions() {
  return {
    type: GET_TRANSACTIONS
  }
}

export function sendTransaction() {
  return {
    type: SEND_TRANSACTION
  }
}

export function showSuccessTransactionScreen(txid) {
  return {
    type: SHOW_SUCCESS_TRANSACTION_SCREEN,
    txid
  }
}

export function hideSuccessTransactionScreen() {
  return {
    type: HIDE_SUCCESS_TRANSACTION_SCREEN
  }
}

// Send IPC event for payments
export const fetchTransactions = () => dispatch => {
  dispatch(getTransactions())
  ipcRenderer.send('lnd', { msg: 'transactions' })
}

// Receive IPC event for payments
export const receiveTransactions = (event, { transactions }) => (dispatch, getState) => {
  dispatch({ type: RECEIVE_TRANSACTIONS, transactions })

  // If our current wallet address has been used, generate a new one.
  const state = getState()
  const currentAddress = state.address.address
  let usedAddresses = []
  transactions.forEach(transaction => {
    decorateTransaction(transaction)
    usedAddresses = usedAddresses.concat(transaction.dest_addresses)
  })
  if (usedAddresses.includes(currentAddress)) {
    dispatch(newAddress('np2wkh'))
  }
}

export const sendCoins = ({ value, addr, currency }) => dispatch => {
  // backend needs amount in satoshis no matter what currency we are using
  const amount = btc.convert(currency, 'sats', value)

  // submit the transaction to LND
  dispatch(sendTransaction())
  ipcRenderer.send('lnd', { msg: 'sendCoins', data: { amount, addr } })

  // Close the form modal once the payment was sent to LND
  // we will do the loading/success UX on the main page
  // so we aren't blocking the user
  dispatch(setFormType(null))
}

// Receive IPC event for successful payment
// TODO: Add payment to state, not a total re-fetch
export const transactionSuccessful = (event, { txid }) => dispatch => {
  // Get the new list of transactions (TODO dont do an entire new fetch)
  dispatch(fetchTransactions())
  // Show successful payment state
  dispatch({ type: TRANSACTION_SUCCESSFULL })

  // Show successful tx state for 5 seconds
  dispatch(showSuccessTransactionScreen(txid))
  setTimeout(() => dispatch(hideSuccessTransactionScreen()), 5000)
  // Fetch new balance
  dispatch(fetchBalance())
  // Reset the payment form
  dispatch(resetPayForm())
}

export const transactionError = (event, { error }) => dispatch => {
  dispatch({ type: TRANSACTION_FAILED })
  dispatch(setError(error))
}

// Listener for when a new transaction is pushed from the subscriber
export const newTransaction = (event, { transaction }) => dispatch => {
  // Fetch new balance
  dispatch(fetchBalance())

  decorateTransaction(transaction)

  dispatch({ type: ADD_TRANSACTION, transaction })

  // HTML 5 desktop notification for the new transaction
  const notifTitle = transaction.received
    ? 'On-chain Transaction Received!'
    : 'On-chain Transaction Sent!'
  const notifBody = transaction.received
    ? "Lucky you, you just received a new on-chain transaction. I'm jealous."
    : "Hate to see 'em go but love to watch 'em leave. Your on-chain transaction successfully sent."

  showNotification(notifTitle, notifBody)

  // Generate a new address
  dispatch(newAddress('np2wkh'))
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [GET_TRANSACTIONS]: state => ({ ...state, transactionLoading: true }),
  [SEND_TRANSACTION]: state => ({ ...state, sendingTransaction: true }),
  [RECEIVE_TRANSACTIONS]: (state, { transactions }) => ({
    ...state,
    transactionLoading: false,
    transactions
  }),
  [TRANSACTION_SUCCESSFULL]: state => ({ ...state, sendingTransaction: false }),
  [TRANSACTION_FAILED]: state => ({ ...state, sendingTransaction: false }),
  [ADD_TRANSACTION]: (state, { transaction }) => {
    // add the transaction only if we are not already aware of it
    return state.transactions.find(tx => tx.tx_hash === transaction.tx_hash)
      ? state
      : {
          ...state,
          transactions: [transaction, ...state.transactions]
        }
  },
  [SHOW_SUCCESS_TRANSACTION_SCREEN]: (state, { txid }) => ({
    ...state,
    successTransactionScreen: { show: true, txid }
  }),
  [HIDE_SUCCESS_TRANSACTION_SCREEN]: state => ({
    ...state,
    successTransactionScreen: { show: false, txid: '' }
  })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  sendingTransaction: false,
  transactionLoading: false,
  transactions: [],
  successTransactionScreen: {
    show: false,
    txid: ''
  }
}

export default function transactionReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
