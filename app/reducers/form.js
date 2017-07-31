// Constants
// ------------------------------------
export const SET_FORM = 'SET_FORM'
export const SET_AMOUNT = 'SET_AMOUNT'
export const SET_MESSAGE = 'SET_MESSAGE'
export const SET_PUBKEY = 'SET_PUBKEY'
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
  [RESET_FORM]: () => (initialState)
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  modalOpen: false,
  formType: 'pay',
  amount: '0',
  message: '',
  pubkey: ''
}

export default function formReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}