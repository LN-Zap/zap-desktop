// ------------------------------------
// Initial State
// ------------------------------------
const initialState = {
  filter: 'ALL_ACTIVITY',
  modal: {
    modalType: null,
    modalProps: {}
  }
}

// ------------------------------------
// Constants
// ------------------------------------
export const SHOW_ACTIVITY_MODAL = 'SHOW_ACTIVITY_MODAL'
export const HIDE_ACTIVITY_MODAL = 'HIDE_ACTIVITY_MODAL'

// ------------------------------------
// Actions
// ------------------------------------
export function showActivityModal(modalType, modalProps) {
  return {
    type: SHOW_ACTIVITY_MODAL,
    modalType,
    modalProps
  }
}

export function hideActivityModal() {
  return {
    type: HIDE_ACTIVITY_MODAL
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SHOW_ACTIVITY_MODAL]: (state, { modalType, modalProps }) => ({ ...state, modal: { modalType, modalProps } }),
  [HIDE_ACTIVITY_MODAL]: (state) => ({ ...state, modal: { modalType: null, modalProps: {} } })
}

// ------------------------------------
// Reducer
// ------------------------------------
export default function activityReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
