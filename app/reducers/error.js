import delay from 'lib/utils/delay'

// ------------------------------------
// Initial State
// ------------------------------------
const initialState = {
  errors: []
}

// ------------------------------------
// Constants
// ------------------------------------
const ERROR_TIMEOUT = 10000
export const SET_ERROR = 'SET_ERROR'
export const CLEAR_ERROR = 'CLEAR_ERROR'

// ------------------------------------
// Actions
// ------------------------------------
export const setError = error => async dispatch => {
  // Cooerce the error into an error item with a random id that we can use for clearning the error later.
  const errorItem = {
    id: Math.random()
      .toString(36)
      .substring(7),
    message: error
  }

  // Set a timer to clear the error after 10 seconds.
  await delay(ERROR_TIMEOUT)

  dispatch(clearError(errorItem.id))

  return dispatch({
    type: SET_ERROR,
    errorItem
  })
}

export function clearError(id) {
  return {
    type: CLEAR_ERROR,
    id
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SET_ERROR]: (state, { errorItem }) => ({
    ...state,
    errors: [...state.errors, errorItem]
  }),
  [CLEAR_ERROR]: (state, { id }) => ({
    ...state,
    errors: state.errors.filter(item => item.id !== id)
  })
}

// ------------------------------------
// Selectors
// ------------------------------------

const errorSelectors = {}
errorSelectors.getErrorState = state => state.error.errors

export { errorSelectors }

// ------------------------------------
// Reducer
// ------------------------------------
export default function errorReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
