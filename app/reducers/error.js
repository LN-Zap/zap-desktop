// ------------------------------------
// Initial State
// ------------------------------------
const initialState = {
  error: null
}

// ------------------------------------
// Constants
// ------------------------------------
export const SET_ERROR = 'SET_ERROR'
export const CLEAR_ERROR = 'CLEAR_ERROR'

// ------------------------------------
// Actions
// ------------------------------------
export function setError(error) {
  return {
    type: SET_ERROR,
    error
  }
}

export function clearError() {
  return {
    type: CLEAR_ERROR
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SET_ERROR]: (state, { error }) => ({ ...state, error }),
  [CLEAR_ERROR]: () => (initialState)
}

// ------------------------------------
// Reducer
// ------------------------------------
export default function errorReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
