import { grpcService } from 'workers'
import createReducer from './utils/createReducer'

// ------------------------------------
// Initial State
// ------------------------------------

const initialState = {
  isPeersLoading: false,
  peersLoadingError: null,
  peers: [],
}

// ------------------------------------
// Constants
// ------------------------------------

export const FETCH_PEERS = 'FETCH_PEERS'
export const FETCH_PEERS_SUCCESS = 'FETCH_PEERS_SUCCESS'
export const FETCH_PEERS_FAILURE = 'FETCH_PEERS_FAILURE'

// ------------------------------------
// Actions
// ------------------------------------

/**
 * fetchPeers - Fetch list of all connected peers.
 *
 * @returns {Function} Thunk
 */
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
  [FETCH_PEERS]: state => {
    state.isPeersLoading = true
  },
  [FETCH_PEERS_SUCCESS]: (state, { peers }) => {
    state.isPeersLoading = false
    state.peers = peers
  },
  [FETCH_PEERS_FAILURE]: (state, { error }) => {
    state.isPeersLoading = false
    state.peersLoadingError = error
  },
}

export default createReducer(initialState, ACTION_HANDLERS)
