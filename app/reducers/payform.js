import { createSelector } from 'reselect'
import bitcoin from 'bitcoinjs-lib'

import isEmpty from 'lodash/isEmpty'

import { setFormType } from './form'
import { tickerSelectors } from './ticker'
import { infoSelectors } from './info'
import { btc, bech32 } from '../utils'

// Initial State
const initialState = {
  amount: '',
  payInput: '',

  invoice: {
    payreq: '',
    r_hash: '',
    amount: '0',
    description: '',
    destination: ''
  },

  showCurrencyFilters: false,

  showErrors: {
    amount: false,
    payInput: false
  }
}

// Constants
// ------------------------------------
export const SET_PAY_AMOUNT = 'SET_PAY_AMOUNT'
export const SET_PAY_INPUT = 'SET_PAY_INPUT'
export const SET_PAY_INVOICE = 'SET_PAY_INVOICE'

export const SET_PAY_CURRENCY_FILTERS = 'SET_PAY_CURRENCY_FILTERS'

export const UPDATE_PAY_ERRORS = 'UPDATE_PAY_ERRORS'

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

export function setCurrencyFilters(showCurrencyFilters) {
  return {
    type: SET_PAY_CURRENCY_FILTERS,
    showCurrencyFilters
  }
}

export function updatePayErrors(errorsObject) {
  return {
    type: UPDATE_PAY_ERRORS,
    errorsObject
  }
}

export const lightningPaymentUri = (event, { payreq }) => dispatch => {
  // Open pay form
  dispatch(setFormType('PAY_FORM'))
  // Set payreq
  dispatch(setPayInput(payreq))
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
  [SET_PAY_AMOUNT]: (state, { amount }) => ({
    ...state,
    amount,
    showErrors: Object.assign(state.showErrors, { amount: false })
  }),
  [SET_PAY_INPUT]: (state, { payInput }) => ({
    ...state,
    payInput,
    showErrors: Object.assign(state.showErrors, { payInput: false })
  }),
  [SET_PAY_INVOICE]: (state, { invoice }) => ({
    ...state,
    invoice,
    showErrors: Object.assign(state.showErrors, { amount: false })
  }),
  [SET_PAY_CURRENCY_FILTERS]: (state, { showCurrencyFilters }) => ({
    ...state,
    showCurrencyFilters
  }),

  [UPDATE_PAY_ERRORS]: (state, { errorsObject }) => ({
    ...state,
    showErrors: Object.assign(state.showErrors, errorsObject)
  }),

  [RESET_FORM]: () => initialState
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

// payment
const sendingPaymentSelector = state => state.payment.sendingPayment

// ticker
const currencySelector = state => state.ticker.currency

payFormSelectors.isOnchain = createSelector(
  payInputSelector,
  infoSelectors.networkSelector,
  (input, network) => {
    try {
      bitcoin.address.toOutputScript(input, network.bitcoinJsNetwork)
      return true
    } catch (e) {
      return false
    }
  }
)

payFormSelectors.isLn = createSelector(payInputSelector, input => {
  if (!input.startsWith('ln')) {
    return false
  }

  try {
    bech32.decode(input)
    return true
  } catch (e) {
    return false
  }
})

payFormSelectors.currentAmount = createSelector(
  payFormSelectors.isLn,
  payAmountSelector,
  payInvoiceSelector,
  currencySelector,
  (isLn, amount, invoice, currency) => {
    if (isLn) {
      switch (currency) {
        case 'btc':
          return btc.satoshisToBtc(invoice.num_satoshis || 0)
        case 'bits':
          return btc.satoshisToBits(invoice.num_satoshis || 0)
        case 'sats':
          return invoice.num_satoshis
        default:
          return invoice.num_satoshis
      }
    }

    return amount
  }
)

payFormSelectors.usdAmount = createSelector(
  payFormSelectors.isLn,
  payAmountSelector,
  payInvoiceSelector,
  currencySelector,
  tickerSelectors.currentTicker,
  (isLn, amount, invoice, currency, ticker) => {
    if (!ticker || !ticker.price_usd) {
      return false
    }

    if (isLn) {
      return btc.satoshisToUsd(invoice.num_satoshis || 0, ticker.price_usd)
    }

    return btc.convert(currency, 'usd', amount, ticker.price_usd)
  }
)

payFormSelectors.payInputMin = createSelector(currencySelector, currency => {
  switch (currency) {
    case 'btc':
      return '0.00000001'
    case 'bits':
      return '0.01'
    case 'sats':
      return '1'
    default:
      return '0'
  }
})

payFormSelectors.inputCaption = createSelector(
  payFormSelectors.isOnchain,
  payFormSelectors.isLn,
  payFormSelectors.currentAmount,
  currencySelector,
  (isOnchain, isLn, amount, currency) => {
    if (!isOnchain && !isLn) {
      return ''
    }

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

payFormSelectors.payFormIsValid = createSelector(
  payFormSelectors.isOnchain,
  payFormSelectors.isLn,
  payAmountSelector,
  (isOnchain, isLn, amount) => {
    const errors = {}

    if (!isLn && amount <= 0) {
      errors.amount = 'Amount must be more than 0'
    }

    if (!isOnchain && !isLn) {
      errors.payInput = 'Must be a valid BTC address or Lightning Network request'
    }

    return {
      errors,
      amountIsValid: isEmpty(errors.amount),
      payInputIsValid: isEmpty(errors.payInput),
      isValid: isEmpty(errors)
    }
  }
)

export { payFormSelectors }

// ------------------------------------
// Reducer
// ------------------------------------
export default function payFormReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
