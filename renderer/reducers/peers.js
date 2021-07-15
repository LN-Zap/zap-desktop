import createReducer from '@zap/utils/createReducer'
import { mainLog } from '@zap/utils/log'
import { updateNodeData } from 'reducers/network'
import { grpc } from 'workers'

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
 * @returns {(dispatch:Function) => Promise<void>} Thunk
 */
export const fetchPeers = () => async dispatch => {
  dispatch({ type: FETCH_PEERS })
  try {
    const { peers } = await grpc.services.Lightning.listPeers()
    peers.forEach(async ({ pubKey }) => {
      try {
        const { node } = await grpc.services.Lightning.getNodeInfo({ pubKey })
        dispatch(updateNodeData([node]))
      } catch (error) {
        mainLog.warn('Unable to get node info for peer %s: %s', pubKey, error)
      }
    })
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
