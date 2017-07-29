// Constants
// ------------------------------------
export const SET_FORM = 'SET_FORM'

// ------------------------------------
// Actions
// ------------------------------------
export function setForm({ modalOpen, type }) {
  return {
    type: TOGGLE_MODAL,
    modalOpen,
    type
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SET_FORM]: (state, { modalOpen, type }) => ({ ...state, modalOpen, type })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  modalOpen: false,
  type: 'create'
}

export default function formReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}