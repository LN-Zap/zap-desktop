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
export const lndStdout = (event, lndBlockHeight) => dispatch => {
  dispatch({ type: RECEIVE_LINE, lndBlockHeight: lndBlockHeight.split(' ')[0].split(/(\r\n|\n|\r)/gm)[0] })
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
  console.log('blockHeight: ', blockData.blocks[0].height)
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
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  syncing: false,
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
