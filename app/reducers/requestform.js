import { createSelector } from 'reselect'
import bitcoin from 'bitcoinjs-lib'

// Initial State
const initialState = {
  amount: '0',
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
  
  [RESET_FORM]: () => (initialState)
}

// ------------------------------------
// Reducer
// ------------------------------------
export default function payFormReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
