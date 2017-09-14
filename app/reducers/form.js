// Initial State
const initialState = {
  modalOpen: false,
  formType: 'pay',
  paymentType: '',
  amount: '0',
  message: '',
  pubkey: '',
  payment_request: ''
}

// Constants
// ------------------------------------
export const SET_FORM = 'SET_FORM'
export const SET_AMOUNT = 'SET_AMOUNT'
export const SET_MESSAGE = 'SET_MESSAGE'
export const SET_PUBKEY = 'SET_PUBKEY'
export const SET_PAYMENT_TYPE = 'SET_PAYMENT_TYPE'
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

export function setPaymentType(paymentType) {
  return {
    type: SET_PAYMENT_TYPE,
    paymentType
  }
}

export function setAmount(amount) {
  return {
    type: SET_AMOUNT,
    amount
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
  [SET_MESSAGE]: (state, { message }) => ({ ...state, message }),
  [SET_PUBKEY]: (state, { pubkey }) => ({ ...state, pubkey }),
  [SET_PAYMENT_TYPE]: (state, { paymentType }) => ({ ...state, paymentType }),
  [SET_PAYMENT_REQUEST]: (state, { payment_request }) => ({ ...state, payment_request }),
  [RESET_FORM]: () => (initialState)
}

// ------------------------------------
// Reducer
// ------------------------------------
export default function formReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
