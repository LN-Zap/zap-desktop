import { grpcService } from 'workers'
import { showError } from './notification'

// ------------------------------------
// Initial State
// ------------------------------------

const initialState = {
  isPeersLoading: false,
  peersLoadingError: null,
  peers: [],
  connecting: false,
  disconnecting: false,
}

// ------------------------------------
// Constants
// ------------------------------------

export const CONNECT_PEER = 'CONNECT_PEER'
export const CONNECT_SUCCESS = 'CONNECT_SUCCESS'
export const CONNECT_FAILURE = 'CONNECT_FAILURE'
export const FETCH_PEERS = 'FETCH_PEERS'
export const FETCH_PEERS_SUCCESS = 'FETCH_PEERS_SUCCESS'
export const FETCH_PEERS_FAILURE = 'FETCH_PEERS_FAILURE'

// ------------------------------------
// Actions
// ------------------------------------

export function connectPeer() {
  return {
    type: CONNECT_PEER,
  }
}

// Send IPC receive for successfully connecting to a peer
export const connectSuccess = peer => dispatch => dispatch({ type: CONNECT_SUCCESS, peer })

// Send IPC receive for unsuccessfully connecting to a peer
export const connectFailure = error => dispatch => {
  dispatch({ type: CONNECT_FAILURE })
  dispatch(showError(error))
}

// Fetch peers.
export const fetchPeers = () => async dispatch => {
  dispatch({ type: FETCH_PEERS })
  try {
    const grpc = await grpcService
    const { peers } = await grpc.services.Lightning.listPeers()
    dispatch({ type: FETCH_PEERS_SUCCESS, peers })
  } catch (error) {
    dispatch({ type: FETCH_PEERS_FAILURE, error })
  }
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
  [FETCH_PEERS]: state => ({ ...state, isPeersLoading: true }),
  [FETCH_PEERS_SUCCESS]: (state, { peers }) => ({ ...state, isPeersLoading: false, peers }),
  [FETCH_PEERS_FAILURE]: (state, { error }) => ({
    ...state,
    isPeersLoading: false,
    peersLoadingError: error,
  }),
}

// ------------------------------------
// Reducer
// ------------------------------------

/**
 * peersReducer - Peers reducer.
 *
 * @param  {object} state = initialState Initial state
 * @param  {object} action Action
 * @returns {object} Final state
 */
export default function peersReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
