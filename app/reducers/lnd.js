import { fetchTicker } from './ticker'
import { fetchBalance } from './balance'
import { fetchInfo } from './info'
// ------------------------------------
// Constants
// ------------------------------------
export const START_SYNCING = 'START_SYNCING'
export const STOP_SYNCING = 'STOP_SYNCING'

export const RECEIVE_LINE = 'RECEIVE_LINE'

// ------------------------------------
// Actions
// ------------------------------------

// Receive IPC event for LND starting its syncing process
export const lndSyncing = () => dispatch => dispatch({ type: START_SYNCING })

// Receive IPC event for LND stoping sync
export const lndSynced = () => dispatch => {
  // Fetch data now that we know LND is synced
  dispatch(fetchTicker())
  dispatch(fetchBalance())
  dispatch(fetchInfo())

  dispatch({ type: STOP_SYNCING })
}

// Receive IPC event for LND streaming a line
export const lndStdout = (event, line) => dispatch => dispatch({ type: RECEIVE_LINE, line })

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [START_SYNCING]: state => ({ ...state, syncing: true }),
  [STOP_SYNCING]: state => ({ ...state, syncing: false }),
  
  [RECEIVE_LINE]: (state, { line }) => ({ ...state, lines: [...state.lines, line] }),
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  syncing: false,
  lines: []
}

export default function lndReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
