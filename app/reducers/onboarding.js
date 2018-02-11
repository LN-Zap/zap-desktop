// ------------------------------------
// Constants
// ------------------------------------


// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  onboarded: false,
  step: 1,
  alias: ''
}

// ------------------------------------
// Reducer
// ------------------------------------
export default function lndReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
