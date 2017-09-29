import { createSelector } from 'reselect'
import bitcoin from 'bitcoinjs-lib'

// Initial State
const initialState = {
  amount: '0',
  payInput: ''
}

// Constants
// ------------------------------------
export const SET_PAY_AMOUNT = 'SET_PAY_AMOUNT'
export const SET_PAY_INPUT = 'SET_PAY_INPUT'

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
  console.log('payInput: ', payInput)
  return {
    type: SET_PAY_INPUT,
    payInput
  }
}

export function resetForm() {
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
  [RESET_FORM]: () => (initialState)
}

// ------------------------------------
// Selector
// ------------------------------------
const payFormSelectors = {}
const payAmountSelector = state => state.payform.payInput
const payInputSelector = state => state.payform.payInput
const currencySelector = state => state.ticker.currencySelector

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

// TODO: Add more robust logic to detect a LN payment request
payFormSelectors.isLn = createSelector(
  payInputSelector,
  input => input.length === 124
)

payFormSelectors.inputCaption = createSelector(
  payFormSelectors.isOnchain,
  payFormSelectors.isLn,
  payAmountSelector,
  currencySelector,
  (isOnchain, isLn, amount, currency) => {
    if (!isOnchain || !isLn) { return }

    if (isOnchain) {
      return `You're about to send ${amount} ${currency.toUpperCase()} on-chain which should take around 10 minutes`
    }

    if (isLn) {
      return `You're about to send ${amount} ${currency.toUpperCase()} over the Lightning Network which will be instant`
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
