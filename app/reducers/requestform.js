import { createSelector } from 'reselect'
import { btc } from 'lib/utils'
import { tickerSelectors } from './ticker'

// Initial State
const initialState = {
  amount: '',
  memo: ''
}

// Constants
// ------------------------------------
export const SET_REQUEST_AMOUNT = 'SET_REQUEST_AMOUNT'
export const SET_REQUEST_MEMO = 'SET_REQUEST_MEMO'
export const SET_PAY_INVOICE = 'SET_PAY_INVOICE'
export const RESET_FORM = 'RESET_FORM'

// ------------------------------------
// Actions
// ------------------------------------
export function setRequestAmount(amount) {
  return {
    type: SET_REQUEST_AMOUNT,
    amount
  }
}

export function setRequestMemo(memo) {
  return {
    type: SET_REQUEST_MEMO,
    memo
  }
}

export function resetRequestForm() {
  return {
    type: RESET_FORM
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SET_REQUEST_AMOUNT]: (state, { amount }) => ({ ...state, amount }),
  [SET_REQUEST_MEMO]: (state, { memo }) => ({ ...state, memo }),
  [RESET_FORM]: () => initialState
}

const requestFormSelectors = {}
const requestAmountSelector = state => state.requestform.amount
const currencySelector = state => state.ticker.currency
const fiatTickerSelector = state => state.ticker.fiatTicker

requestFormSelectors.fiatAmount = createSelector(
  requestAmountSelector,
  currencySelector,
  tickerSelectors.currentTicker,
  fiatTickerSelector,
  (amount, currency, currentTicker, fiatTicker) => {
    if (!currentTicker || !currentTicker[fiatTicker].last) {
      return false
    }

    return btc.convert(currency, 'fiat', amount, currentTicker[fiatTicker].last)
  }
)

export { requestFormSelectors }

// ------------------------------------
// Reducer
// ------------------------------------
export default function payFormReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
