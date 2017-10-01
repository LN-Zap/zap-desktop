import { createSelector } from 'reselect'
import bitcoin from 'bitcoinjs-lib'
import { tickerSelectors } from './ticker'
import { btc, bech32 } from '../utils'

// Initial State
const initialState = {
  amount: '0',
  payInput: '',

  invoice: {
    payreq: '',
    r_hash: '',
    amount: '0'
  }
}

// Constants
// ------------------------------------
export const SET_PAY_AMOUNT = 'SET_PAY_AMOUNT'
export const SET_PAY_INPUT = 'SET_PAY_INPUT'
export const SET_PAY_INVOICE = 'SET_PAY_INVOICE'

export const RESET_FORM = 'RESET_FORM'

// ------------------------------------
// Actions
// ------------------------------------
export function setPayAmount(amount) {
  return {
    type: SET_PAY_AMOUNT,
    amount
  }
}

export function setPayInput(payInput) {
  return {
    type: SET_PAY_INPUT,
    payInput
  }
}

export function setPayInvoice(invoice) {
  return {
    type: SET_PAY_INVOICE,
    invoice
  }
}

export function resetPayForm() {
  return {
    type: RESET_FORM
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SET_PAY_AMOUNT]: (state, { amount }) => ({ ...state, amount }),
  [SET_PAY_INPUT]: (state, { payInput }) => ({ ...state, payInput }),
  [SET_PAY_INVOICE]: (state, { invoice }) => ({ ...state, invoice }),

  [RESET_FORM]: () => (initialState)
}

// ------------------------------------
// Selector
// ------------------------------------
const payFormSelectors = {}
const payAmountSelector = state => state.payform.amount
const payInputSelector = state => state.payform.payInput
const payInvoiceSelector = state => state.payform.invoice

// transaction
const sendingTransactionSelector = state => state.transaction.sendingTransaction

// transaction
const sendingPaymentSelector = state => state.payment.sendingPayment

// ticker
const currencySelector = state => state.ticker.currency

payFormSelectors.isOnchain = createSelector(
  payInputSelector,
  (input) => {
    // TODO: work with bitcoin-js to fix p2wkh error and make testnet/mainnet dynamic
    try {
      bitcoin.address.toOutputScript(input, bitcoin.networks.testnet)
      return true
    } catch (e) {
      return false
    }
  }
)

payFormSelectors.isLn = createSelector(
  payInputSelector,
  input => {
    if (!input.startsWith('ln')) { return false }

    try {
      bech32.decode(input)
      return true
    } catch (e) {
      return false
    }
  }
)

payFormSelectors.currentAmount = createSelector(
  payFormSelectors.isLn,
  payAmountSelector,
  payInvoiceSelector,
  currencySelector,
  tickerSelectors.currentTicker,
  (isLn, amount, invoice, currency, ticker) => {
    if (isLn) {
      return currency === 'usd' ? btc.satoshisToUsd((invoice.num_satoshis || 0), ticker.price_usd) : btc.satoshisToBtc((invoice.num_satoshis || 0))
    }

    return amount
  }
)

payFormSelectors.inputCaption = createSelector(
  payFormSelectors.isOnchain,
  payFormSelectors.isLn,
  payFormSelectors.currentAmount,
  currencySelector,
  (isOnchain, isLn, amount, currency) => {
    if (!isOnchain && !isLn) { return '' }

    if (isOnchain) {
      return `You're about to send ${amount} ${currency.toUpperCase()} on-chain which should take around 10 minutes`
    }

    if (isLn) {
      return `You're about to send ${amount} ${currency.toUpperCase()} over the Lightning Network which will be instant`
    }

    return ''
  }
)

payFormSelectors.showPayLoadingScreen = createSelector(
  sendingTransactionSelector,
  sendingPaymentSelector,
  (sendingTransaction, sendingPayment) => sendingTransaction || sendingPayment
)

export { payFormSelectors }

// ------------------------------------
// Reducer
// ------------------------------------
export default function payFormReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
