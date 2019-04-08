import { lightningService } from 'workers'
import { showError } from './notification'

// ------------------------------------
// Constants
// ------------------------------------
export const CONNECT_PEER = 'CONNECT_PEER'
export const CONNECT_SUCCESS = 'CONNECT_SUCCESS'
export const CONNECT_FAILURE = 'CONNECT_FAILURE'
export const GET_PEERS = 'GET_PEERS'
export const RECEIVE_PEERS = 'RECEIVE_PEERS'

// ------------------------------------
// Actions
// ------------------------------------
export function connectPeer() {
  return {
    type: CONNECT_PEER,
  }
}
export function getPeers() {
  return {
    type: GET_PEERS,
  }
}

// Send IPC event for peers
export const fetchPeers = () => async dispatch => {
  dispatch(getPeers())
  const lightning = await lightningService
  const peers = await lightning.listPeers()
  dispatch(receivePeers(peers))
}

// Receive IPC event for peers
export const receivePeers = ({ peers }) => dispatch => dispatch({ type: RECEIVE_PEERS, peers })

// Send IPC receive for successfully connecting to a peer
export const connectSuccess = peer => dispatch => dispatch({ type: CONNECT_SUCCESS, peer })

// Send IPC receive for unsuccessfully connecting to a peer
export const connectFailure = error => dispatch => {
  dispatch({ type: CONNECT_FAILURE })
  dispatch(showError(error))
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [CONNECT_PEER]: state => ({ ...state, connecting: true }),
  [CONNECT_SUCCESS]: (state, { peer }) => ({
    ...state,
    connecting: false,
    peers: [...state.peers, peer],
  }),
  [CONNECT_FAILURE]: state => ({ ...state, connecting: false }),
  [GET_PEERS]: state => ({ ...state, peersLoading: true }),
  [RECEIVE_PEERS]: (state, { peers }) => ({ ...state, peersLoading: false, peers }),
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  peersLoading: false,
  peers: [],
  connecting: false,
  disconnecting: false,
}

export default function peersReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
