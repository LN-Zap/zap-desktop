import { ipcRenderer } from 'electron'
import { showNotification } from '../notifications'
import { btc, usd } from '../utils'
import { setForm, resetForm } from './form'
import { showModal } from './modal'

// ------------------------------------
// Constants
// ------------------------------------
export const GET_TRANSACTIONS = 'GET_TRANSACTIONS'
export const RECEIVE_TRANSACTIONS = 'RECEIVE_TRANSACTIONS'

export const SEND_TRANSACTION = 'SEND_TRANSACTION'

export const TRANSACTION_SUCCESSFULL = 'TRANSACTION_SUCCESSFULL'
export const TRANSACTION_FAILED = 'TRANSACTION_FAILED'

export const ADD_TRANSACTION = 'ADD_TRANSACTION'

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

// Send IPC event for payments
export const fetchTransactions = () => (dispatch) => {
  dispatch(getTransactions())
  ipcRenderer.send('lnd', { msg: 'transactions' })
}

// Receive IPC event for payments
export const receiveTransactions = (event, { transactions }) => dispatch => dispatch({ type: RECEIVE_TRANSACTIONS, transactions })

export const sendCoins = ({ value, addr, currency, rate }) => (dispatch) => {
  const amount = currency === 'usd' ? btc.btcToSatoshis(usd.usdToBtc(value, rate)) : btc.btcToSatoshis(value)
  dispatch(sendTransaction())
  ipcRenderer.send('lnd', { msg: 'sendCoins', data: { amount, addr } })
}

// Receive IPC event for successful payment
// TODO: Add payment to state, not a total re-fetch
export const transactionSuccessful = (event, { amount, addr, txid }) => (dispatch) => {
  // Get the new list of transactions (TODO dont do an entire new fetch)
  dispatch(fetchTransactions())
  // Close the form modal once the payment was succesful
  dispatch(setForm({ modalOpen: false }))
  // Show successful payment state
  dispatch(showModal('SUCCESSFUL_SEND_COINS', { txid, amount, addr }))
  // TODO: Add successful on-chain payment to payments list once payments list supports on-chain and LN
  // dispatch({ type: PAYMENT_SUCCESSFULL, payment: { amount, addr, txid, pending: true } })
  dispatch({ type: TRANSACTION_SUCCESSFULL })
  // Reset the payment form
  dispatch(resetForm())
}

export const transactionError = () => (dispatch) => {
  dispatch({ type: TRANSACTION_FAILED })
}

// Listener for when a new transaction is pushed from the subscriber
export const newTransaction = (event, { transaction }) => (dispatch) => {
  dispatch({ type: ADD_TRANSACTION, transaction })

  // HTML 5 desktop notification for the new transaction
  const notifTitle = transaction.amount > 0 ? 'On-chain Transaction Received!' : 'On-chain Transaction Sent!'
  const notifBody = transaction.amount > 0 ? 'Lucky you, you just received a new on-chain transaction. I\'m jealous.' : 'Hate to see \'em go but love to watch \'em leave. Your on-chain transaction successfully sent.' // eslint-disable-line

  showNotification(notifTitle, notifBody)
}


// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [GET_TRANSACTIONS]: state => ({ ...state, transactionLoading: true }),
  [SEND_TRANSACTION]: state => ({ ...state, sendingTransaction: true }),
  [RECEIVE_TRANSACTIONS]: (state, { transactions }) => ({ ...state, transactionLoading: false, transactions }),
  [TRANSACTION_SUCCESSFULL]: state => ({ ...state, sendingTransaction: false }),
  [TRANSACTION_FAILED]: state => ({ ...state, sendingTransaction: false }),
  [ADD_TRANSACTION]: (state, { transaction }) => ({ ...state, transactions: [transaction, ...state.transactions] })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  sendingTransaction: false,
  transactionLoading: false,
  transactions: []
}

export default function transactionReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
