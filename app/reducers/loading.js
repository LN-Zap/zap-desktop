// ------------------------------------
// Initial State
// ------------------------------------
const initialState = {
  isLoading: true,
  isMounted: false
}

// ------------------------------------
// Constants
// ------------------------------------
export const SET_LOADING = 'SET_LOADING'
export const SET_MOUNTED = 'SET_MOUNTED'

// ------------------------------------
// Actions
// ------------------------------------
export function setLoading(isLoading) {
  return {
    type: SET_LOADING,
    isLoading
  }
}

export function setMounted(isMounted) {
  return {
    type: SET_MOUNTED,
    isMounted
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SET_LOADING]: (state, { isLoading }) => ({ ...state, isLoading }),
  [SET_MOUNTED]: (state, { isMounted }) => ({ ...state, isMounted })
}

// ------------------------------------
// Selectors
// ------------------------------------

const loadingSelectors = {}
loadingSelectors.isLoading = state => state.loading.isLoading
loadingSelectors.isMounted = state => state.loading.isMounted

export { loadingSelectors }

// ------------------------------------
// Reducer
// ------------------------------------
export default function loadingReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
