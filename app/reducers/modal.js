// ------------------------------------
// Initial State
// ------------------------------------
const initialState = {
  modalType: null,
  modalProps: {}
}

// ------------------------------------
// Constants
// ------------------------------------
export const SHOW_MODAL = 'SHOW_MODAL'
export const HIDE_MODAL = 'HIDE_MODAL'

// ------------------------------------
// Actions
// ------------------------------------
export function showModal(modalType, modalProps) {
  return {
    type: SHOW_MODAL,
    modalType,
    modalProps
  }
}

export function hideModal() {
  return {
    type: HIDE_MODAL
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SHOW_MODAL]: (state, { modalType, modalProps }) => ({ ...state, modalType, modalProps }),
  [HIDE_MODAL]: () => initialState
}

// ------------------------------------
// Reducer
// ------------------------------------
export default function modalReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
