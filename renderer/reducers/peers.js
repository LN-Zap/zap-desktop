import { grpcService } from 'workers'

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
 * @returns {object} Next state
 */
export default function peersReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
