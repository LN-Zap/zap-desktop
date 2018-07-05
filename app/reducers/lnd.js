import { createSelector } from 'reselect'
import { fetchTicker } from './ticker'
import { fetchBalance } from './balance'
import { fetchInfo } from './info'
import { requestBlockHeight } from '../api'
import { showNotification } from '../notifications'
// ------------------------------------
// Constants
// ------------------------------------
export const START_SYNCING = 'START_SYNCING'
export const STOP_SYNCING = 'STOP_SYNCING'

export const GET_BLOCK_HEIGHT = 'GET_BLOCK_HEIGHT'
export const RECEIVE_BLOCK_HEIGHT = 'RECEIVE_BLOCK_HEIGHT'
export const RECEIVE_BLOCK = 'RECEIVE_BLOCK'

export const GRPC_DISCONNECTED = 'GRPC_DISCONNECTED'
export const GRPC_CONNECTED = 'GRPC_CONNECTED'

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

  // HTML 5 desktop notification for the new transaction
  const notifTitle = 'Lightning Node Synced'
  const notifBody = "Visa who? You're your own payment processor now!"

  showNotification(notifTitle, notifBody)
}

export const grpcDisconnected = () => dispatch => dispatch({ type: GRPC_DISCONNECTED })

export const grpcConnected = () => dispatch => {
  dispatch(fetchInfo())
  dispatch({ type: GRPC_CONNECTED })
}

// Receive IPC event for LND streaming a line
export const lndBlockHeight = (event, height) => dispatch => {
  dispatch({ type: RECEIVE_BLOCK, lndBlockHeight: height })
}

export const lndBlockHeightTarget = (event, height) => dispatch => {
  dispatch({ type: RECEIVE_BLOCK_HEIGHT, blockHeight: height })
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
export const fetchBlockHeight = () => async dispatch => {
  dispatch(getBlockHeight())
  const blockHeight = await requestBlockHeight()
  dispatch(receiveBlockHeight(blockHeight))
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [START_SYNCING]: state => ({ ...state, syncing: true }),
  [STOP_SYNCING]: state => ({ ...state, syncing: false }),

  [GET_BLOCK_HEIGHT]: state => ({ ...state, fetchingBlockHeight: true }),
  [RECEIVE_BLOCK_HEIGHT]: (state, { blockHeight }) => ({
    ...state,
    blockHeight,
    fetchingBlockHeight: false
  }),
  [RECEIVE_BLOCK]: (state, { lndBlockHeight }) => ({ ...state, lndBlockHeight }),

  [GRPC_DISCONNECTED]: state => ({ ...state, grpcStarted: false }),
  [GRPC_CONNECTED]: state => ({ ...state, grpcStarted: true })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  syncing: false,
  grpcStarted: false,
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
  (blockHeight, lndBlockHeight) => {
    const percentage = Math.floor((lndBlockHeight / blockHeight) * 100)

    if (percentage === Infinity || Number.isNaN(percentage)) {
      return undefined
    }

    return parseInt(percentage, 10)
  }
)

export { lndSelectors }

export default function lndReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
