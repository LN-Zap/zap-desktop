// Constants
// ------------------------------------
export const SET_FORM = 'SET_FORM'

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

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SET_FORM]: (state, { modalOpen, formType }) => ({ ...state, modalOpen, formType })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  modalOpen: false,
  formType: 'pay'
}

export default function formReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}