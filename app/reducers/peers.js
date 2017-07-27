import { callApi } from '../api'
// ------------------------------------
// Constants
// ------------------------------------
export const GET_PEERS = 'GET_PEERS'
export const RECEIVE_PEERS = 'RECEIVE_PEERS'

// ------------------------------------
// Actions
// ------------------------------------
export function getPeers() {
  return {
    type: GET_PEERS
  }
}

export function receivePeers({ peers }) {
  return {
    type: RECEIVE_PEERS,
    peers
  }
}

export const fetchPeers = () => async (dispatch) => {
  dispatch(getPeers())
  const peers = await callApi('peers')
  dispatch(receivePeers(peers.data))
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [GET_PEERS]: (state) => ({ ...state, peersLoading: true }),
  [RECEIVE_PEERS]: (state, { peers }) => ({ ...state, peersLoading: false, peers })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  peersLoading: false,
  peers: []
}

export default function peersReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}