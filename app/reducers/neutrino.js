import { ipcRenderer } from 'electron'
// ------------------------------------
// Constants
// ------------------------------------
export const RECEIVE_DATA = 'RECEIVE_DATA'

// ------------------------------------
// Actions
// ------------------------------------

// Receive IPC event for neutrino data
export const receiveData = (event, data) => dispatch => dispatch({ type: RECEIVE_DATA, data })

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [RECEIVE_DATA]: (state, { data }) => ({ ...state, data: [...state.data, data] })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  data: ''
}

export default function neutrinoReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
