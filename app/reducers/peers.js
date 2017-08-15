import { createSelector } from 'reselect'
import { callApi } from '../api'
// ------------------------------------
// Constants
// ------------------------------------
export const CONNECT_PEER = 'CONNECT_PEER'
export const CONNECT_SUCCESS = 'CONNECT_SUCCESS'
export const CONNECT_FAILURE = 'CONNECT_FAILURE'

export const DISCONNECT_PEER = 'DISCONNECT_PEER'
export const DISCONNECT_SUCCESS = 'DISCONNECT_SUCCESS'
export const DISCONNECT_FAILURE = 'DISCONNECT_FAILURE'

export const SET_PEER_FORM = 'SET_PEER_FORM'

export const SET_PEER = 'SET_PEER'

export const GET_PEERS = 'GET_PEERS'
export const RECEIVE_PEERS = 'RECEIVE_PEERS'

// ------------------------------------
// Actions
// ------------------------------------
export function connectPeer() {
  return {
    type: CONNECT_PEER
  }
}

export function connectSuccess(peer) {
  return {
    type: CONNECT_SUCCESS,
    peer
  }
}

export function connectFailure() {
  return {
    type: CONNECT_FAILURE
  }
}

export function disconnectPeer() {
  return {
    type: DISCONNECT_PEER
  }
}

export function disconnectSuccess(pubkey) {
  return {
    type: DISCONNECT_SUCCESS,
    pubkey
  }
}

export function disconnectFailure() {
  return {
    type: DISCONNECT_FAILURE
  }
}

export function setPeerForm(form) {
  return {
    type: SET_PEER_FORM,
    form
  }
}

export function setPeer(peer) {
  return {
    type: SET_PEER,
    peer
  }
}

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

export const connectRequest = ({ pubkey, host }) => async (dispatch) => {
  dispatch(connectPeer())
  const success = await callApi('connect', 'post', { pubkey, host })
  success.data ? dispatch(connectSuccess({ pub_key: pubkey, address: host, peer_id: success.data.peer_id })) : dispatch(connectFailure())

  return success
}

export const disconnectRequest = ({ pubkey }) => async (dispatch) => {
  dispatch(disconnectPeer())
  const success = await callApi('disconnect', 'post', { pubkey })
  console.log('success: ', success)
  success ? dispatch(disconnectSuccess(pubkey)) : dispatch(disconnectFailure())

  return success
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [DISCONNECT_PEER]: state => ({ ...state, disconnecting: true }),
  [DISCONNECT_SUCCESS]: (state, { pubkey }) => ({ ...state, disconnecting: false, peers: state.peers.filter(peer => peer.pub_key !== pubkey) }),
  [DISCONNECT_FAILURE]: state => ({ ...state, disconnecting: false }),

  [CONNECT_PEER]: state => ({ ...state, connecting: true }),
  [CONNECT_SUCCESS]: (state, { peer }) => ({ ...state, connecting: false, peers: [...state.peers, peer] }),
  [CONNECT_FAILURE]: state => ({ ...state, connecting: false }),

  [SET_PEER_FORM]: (state, { form }) => ({ ...state, peerForm: Object.assign({}, state.peerForm, form) }),

  [SET_PEER]: (state, { peer }) => ({ ...state, peer }),

  [GET_PEERS]: state => ({ ...state, peersLoading: true }),
  [RECEIVE_PEERS]: (state, { peers }) => ({ ...state, peersLoading: false, peers })
}

const peersSelectors = {}
const peerSelector = state => state.peers.peer

peersSelectors.peerModalOpen = createSelector(
  peerSelector,
  peer => (!!peer)
)

export { peersSelectors }

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  peersLoading: false,
  peers: [],
  peer: null,
  peerForm: {
    isOpen: false,
    pubkey: '',
    host: ''
  },
  connecting: false,
  disconnecting: false
}

export default function peersReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
