import { createSelector } from 'reselect'
import { fetchTicker } from './ticker'
import { fetchBalance } from './balance'
import { fetchInfo } from './info'
import { requestBlockHeight } from '../api'
// ------------------------------------
// Constants
// ------------------------------------
export const START_SYNCING = 'START_SYNCING'
export const STOP_SYNCING = 'STOP_SYNCING'

export const RECEIVE_LINE = 'RECEIVE_LINE'

export const GET_BLOCK_HEIGHT = 'GET_BLOCK_HEIGHT'
export const RECEIVE_BLOCK_HEIGHT = 'RECEIVE_BLOCK_HEIGHT'

export const GRPC_DISCONNECTED = 'GRPC_DISCONNECTED'
export const GRPC_CONNECTED = 'GRPC_CONNECTED'

// ------------------------------------
// Actions
// ------------------------------------

// Receive IPC event for LND starting its syncing process
export const lndSyncing = () => dispatch => dispatch({ type: START_SYNCING })

// Receive IPC event for LND stoping sync
export const lndSynced = () => (dispatch) => {
  // Fetch data now that we know LND is synced
  dispatch(fetchTicker())
  dispatch(fetchBalance())
  dispatch(fetchInfo())

  dispatch({ type: STOP_SYNCING })
}

export const grpcDisconnected = () => (dispatch) => dispatch({ type: GRPC_DISCONNECTED })

export const grpcConnected = () => (dispatch) => dispatch({ type: GRPC_CONNECTED })

// Receive IPC event for LND streaming a line
export const lndStdout = (event, line) => dispatch => {
  let height
  let trimmed

  if (line.includes('Caught up to height')) {
    trimmed = line.slice(line.indexOf('Caught up to height') + 'Caught up to height'.length).trim()
    height = trimmed.split(' ')[0].split(/(\r\n|\n|\r)/gm)[0]
  }

  if (line.includes('Catching up block hashes to height')) {
    trimmed = line.slice(line.indexOf('Catching up block hashes to height') + 'Catching up block hashes to height'.length).trim()
    height = trimmed.match(/[-]{0,1}[\d.]*[\d]+/g)[0]
  }
  
  dispatch({ type: RECEIVE_LINE, lndBlockHeight: height })
}


export function getBlockHeight() {
  return {
    type: GET_BLOCK_HEIGHT
  }
}

export function receiveBlockHeight(blockHeight) {
  return {
    type: RECEIVE_BLOCK_HEIGHT,
    blockHeight
  }
}

// Fetch current block height
export const fetchBlockHeight = () => async (dispatch) => {
  dispatch(getBlockHeight())
  const blockData = await requestBlockHeight()
  dispatch(receiveBlockHeight(blockData.blocks[0].height))
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [START_SYNCING]: state => ({ ...state, syncing: true }),
  [STOP_SYNCING]: state => ({ ...state, syncing: false }),

  [RECEIVE_LINE]: (state, { lndBlockHeight }) => ({ ...state, lndBlockHeight }),

  [GET_BLOCK_HEIGHT]: state => ({ ...state, fetchingBlockHeight: true }),
  [RECEIVE_BLOCK_HEIGHT]: (state, { blockHeight }) => ({ ...state, blockHeight, fetchingBlockHeight: false }),
  
  [GRPC_DISCONNECTED]: state => ({ ...state, grpcStarted: false }),
  [GRPC_CONNECTED]: state => ({ ...state, grpcStarted: true })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  syncing: false,
  grpcStarted: true,
  fetchingBlockHeight: false,
  lines: [],
  blockHeight: 0,
  lndBlockHeight: 0
}

// ------------------------------------
// Reducer
// ------------------------------------
const lndSelectors = {}
const blockHeightSelector = state => state.lnd.blockHeight
const lndBlockHeightSelector = state => state.lnd.lndBlockHeight

lndSelectors.syncPercentage = createSelector(
  blockHeightSelector,
  lndBlockHeightSelector,
  (blockHeight, lndBlockHeight) => (Math.floor((lndBlockHeight / blockHeight) * 100))
)

export { lndSelectors }

export default function lndReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
