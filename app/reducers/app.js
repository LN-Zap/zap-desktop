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
export const RESET_APP = 'RESET_APP'

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

export function resetApp() {
  return {
    type: RESET_APP
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

const appSelectors = {}
appSelectors.isLoading = state => state.app.isLoading
appSelectors.isMounted = state => state.app.isMounted

export { appSelectors }

// ------------------------------------
// Reducer
// ------------------------------------
export default function loadingReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
