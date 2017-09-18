import { createSelector } from 'reselect'
import bitcoin from 'bitcoinjs-lib'

// Initial State
const initialState = {
  modalOpen: false,
  formType: 'pay',
  amount: '0',
  onchainAmount: '0',
  message: '',
  pubkey: '',
  payment_request: ''
}

// Constants
// ------------------------------------
export const SET_FORM = 'SET_FORM'
export const SET_AMOUNT = 'SET_AMOUNT'
export const SET_ONCHAIN_AMOUNT = 'SET_ONCHAIN_AMOUNT'
export const SET_MESSAGE = 'SET_MESSAGE'
export const SET_PUBKEY = 'SET_PUBKEY'
export const SET_PAYMENT_REQUEST = 'SET_PAYMENT_REQUEST'
export const RESET_FORM = 'RESET_FORM'

// ------------------------------------
// Actions
// ------------------------------------
export function setForm({ modalOpen, formType }) {
  return {
    type: SET_FORM,
    modalOpen,
    formType
  }
}

export function setAmount(amount) {
  return {
    type: SET_AMOUNT,
    amount
  }
}

export function setOnchainAmount(onchainAmount) {
  return {
    type: SET_ONCHAIN_AMOUNT,
    onchainAmount
  }
}

export function setMessage(message) {
  return {
    type: SET_MESSAGE,
    message
  }
}

export function setPubkey(pubkey) {
  return {
    type: SET_PUBKEY,
    pubkey
  }
}

export function setPaymentRequest(payment_request) {
  return {
    type: SET_PAYMENT_REQUEST,
    payment_request
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
  [SET_FORM]: (state, { modalOpen, formType }) => ({ ...state, modalOpen, formType }),
  [SET_AMOUNT]: (state, { amount }) => ({ ...state, amount }),
  [SET_ONCHAIN_AMOUNT]: (state, { onchainAmount }) => ({ ...state, onchainAmount }),
  [SET_MESSAGE]: (state, { message }) => ({ ...state, message }),
  [SET_PUBKEY]: (state, { pubkey }) => ({ ...state, pubkey }),
  [SET_PAYMENT_REQUEST]: (state, { payment_request }) => ({ ...state, payment_request }),
  [RESET_FORM]: () => (initialState)
}

// ------------------------------------
// Selector
// ------------------------------------
const formSelectors = {}
const paymentRequestSelector = state => state.form.payment_request

formSelectors.isOnchain = createSelector(
  paymentRequestSelector,
  (paymentRequest) => {
    // TODO: work with bitcoin-js to fix p2wkh error and make testnet/mainnet dynamic
    try {
      bitcoin.address.toOutputScript(paymentRequest, bitcoin.networks.testnet)
      return true
    } catch (e) {
      return false
    }
  }
)

// TODO: Add more robust logic to detect a LN payment request
formSelectors.isLn = createSelector(
  paymentRequestSelector,
  paymentRequest => paymentRequest.length === 124
)

export { formSelectors }

// ------------------------------------
// Reducer
// ------------------------------------
export default function formReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
