import Store from 'electron-store'
import { createSelector } from 'reselect'
import { fetchTicker } from './ticker'
import { fetchBalance } from './balance'
import { fetchInfo, setHasSynced } from './info'
import { showNotification } from '../notifications'
// ------------------------------------
// Constants
// ------------------------------------
export const SET_SYNC_STATUS_PENDING = 'SET_SYNC_STATUS_PENDING'
export const SET_SYNC_STATUS_WAITING = 'SET_SYNC_STATUS_WAITING'
export const SET_SYNC_STATUS_IN_PROGRESS = 'SET_SYNC_STATUS_IN_PROGRESS'
export const SET_SYNC_STATUS_COMPLETE = 'SET_SYNC_STATUS_COMPLETE'

export const RECEIVE_BLOCK_HEIGHT = 'RECEIVE_BLOCK_HEIGHT'
export const RECEIVE_BLOCK = 'RECEIVE_BLOCK'

export const GRPC_DISCONNECTED = 'GRPC_DISCONNECTED'
export const GRPC_CONNECTED = 'GRPC_CONNECTED'

// ------------------------------------
// Actions
// ------------------------------------

// Receive IPC event for LND sync status change.
export const lndSyncStatus = (event, status) => (dispatch, getState) => {
  const notifTitle = 'Lightning Node Synced'
  const notifBody = "Visa who? You're your own payment processor now!"

  // Persist the fact that the wallet has been synced at least once.
  const state = getState()
  const pubKey = state.info.data.identity_pubkey
  if (pubKey) {
    const store = new Store({ name: 'wallet' })
    store.set(`${pubKey}.hasSynced`, true)
  }

  switch (status) {
    case 'waiting':
      dispatch({ type: SET_SYNC_STATUS_WAITING })
      break
    case 'in-progress':
      dispatch({ type: SET_SYNC_STATUS_IN_PROGRESS })
      break
    case 'complete':
      dispatch({ type: SET_SYNC_STATUS_COMPLETE })

      dispatch(setHasSynced(true))

      // Fetch data now that we know LND is synced
      dispatch(fetchTicker())
      dispatch(fetchBalance())
      dispatch(fetchInfo())

      // HTML 5 desktop notification for the new transaction
      showNotification(notifTitle, notifBody)
      break
    default:
      dispatch({ type: SET_SYNC_STATUS_PENDING })
  }
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

export const currentBlockHeight = (event, height) => dispatch => {
  dispatch({ type: RECEIVE_BLOCK_HEIGHT, blockHeight: height })
}

export function receiveBlockHeight(blockHeight) {
  return {
    type: RECEIVE_BLOCK_HEIGHT,
    blockHeight
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SET_SYNC_STATUS_PENDING]: state => ({ ...state, syncStatus: 'pending' }),
  [SET_SYNC_STATUS_WAITING]: state => ({ ...state, syncStatus: 'waiting' }),
  [SET_SYNC_STATUS_IN_PROGRESS]: state => ({ ...state, syncStatus: 'in-progress' }),
  [SET_SYNC_STATUS_COMPLETE]: state => ({ ...state, syncStatus: 'complete' }),

  [RECEIVE_BLOCK_HEIGHT]: (state, { blockHeight }) => ({
    ...state,
    blockHeight
  }),
  [RECEIVE_BLOCK]: (state, { lndBlockHeight }) => ({ ...state, lndBlockHeight }),

  [GRPC_DISCONNECTED]: state => ({ ...state, grpcStarted: false }),
  [GRPC_CONNECTED]: state => ({ ...state, grpcStarted: true })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  syncStatus: 'pending',
  grpcStarted: false,
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
