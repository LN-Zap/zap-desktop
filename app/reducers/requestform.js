import { createSelector } from 'reselect'
import { btc } from 'utils'
import { tickerSelectors } from './ticker'

// Initial State
const initialState = {
  amount: '',
  memo: '',
  showCurrencyFilters: false
}

// Constants
// ------------------------------------
export const SET_REQUEST_AMOUNT = 'SET_REQUEST_AMOUNT'
export const SET_REQUEST_MEMO = 'SET_REQUEST_MEMO'
export const SET_PAY_INVOICE = 'SET_PAY_INVOICE'

export const SET_REQUEST_CURRENCY_FILTERS = 'SET_REQUEST_CURRENCY_FILTERS'

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

export function setRequestCurrencyFilters(showCurrencyFilters) {
  return {
    type: SET_REQUEST_CURRENCY_FILTERS,
    showCurrencyFilters
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SET_REQUEST_AMOUNT]: (state, { amount }) => ({ ...state, amount }),
  [SET_REQUEST_MEMO]: (state, { memo }) => ({ ...state, memo }),
  [SET_REQUEST_CURRENCY_FILTERS]: (state, { showCurrencyFilters }) => ({ ...state, showCurrencyFilters }),

  [RESET_FORM]: () => (initialState)
}

const requestFormSelectors = {}
const requestAmountSelector = state => state.requestform.amount
const currencySelector = state => state.ticker.currency

requestFormSelectors.usdAmount = createSelector(
  requestAmountSelector,
  currencySelector,
  tickerSelectors.currentTicker,
  
  (amount, currency, ticker) => {
    if (!ticker || !ticker.price_usd) { return false }

    switch (currency) {
      case 'btc':
        return btc.btcToUsd(amount, ticker.price_usd)
      case 'bits':
        return btc.bitsToUsd(amount, ticker.price_usd)
      case 'sats':
        return btc.satoshisToUsd(amount, ticker.price_usd)
      default:
        return ''
    }    
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
