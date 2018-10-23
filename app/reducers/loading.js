// ------------------------------------
// Initial State
// ------------------------------------
const initialState = {
  isLoading: true
}

// ------------------------------------
// Constants
// ------------------------------------
export const SET_LOADING = 'SET_LOADING'

// ------------------------------------
// Actions
// ------------------------------------
export function setLoading(isLoading) {
  return {
    type: SET_LOADING,
    isLoading
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SET_LOADING]: (state, { isLoading }) => ({ ...state, isLoading })
}

// ------------------------------------
// Selectors
// ------------------------------------

const loadingSelectors = {}
loadingSelectors.isLoading = state => state.loading.isLoading

export { loadingSelectors }

// ------------------------------------
// Reducer
// ------------------------------------
export default function loadingReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
