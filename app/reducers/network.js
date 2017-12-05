import { createSelector } from 'reselect'
import { ipcRenderer } from 'electron'

// ------------------------------------
// Constants
// ------------------------------------
export const GET_DESCRIBE_NETWORK = 'GET_DESCRIBE_NETWORK'
export const RECEIVE_DESCRIBE_NETWORK = 'RECEIVE_DESCRIBE_NETWORK'

export const GET_QUERY_ROUTES = 'GET_QUERY_ROUTES'
export const RECEIVE_QUERY_ROUTES = 'RECEIVE_QUERY_ROUTES'

export const SET_CURRENT_ROUTE = 'SET_CURRENT_ROUTE'

export const SET_CURRENT_CHANNEL = 'SET_CURRENT_CHANNEL'

export const SET_CURRENT_TAB = 'SET_CURRENT_TAB'

export const SET_CURRENT_PEER = 'SET_CURRENT_PEER'

export const UPDATE_PAY_REQ = 'UPDATE_PAY_REQ'

export const UPDATE_SELECTED_PEERS = 'UPDATE_SELECTED_PEERS'

export const UPDATE_SELECTED_CHANNELS = 'UPDATE_SELECTED_CHANNELS'

// ------------------------------------
// Actions
// ------------------------------------
export function getDescribeNetwork() {
  return {
    type: GET_DESCRIBE_NETWORK
  }
}

export function getQueryRoutes(pubkey) {
  return {
    type: GET_QUERY_ROUTES,
    pubkey
  }
}

export function setCurrentRoute(route) {
  return {
    type: SET_CURRENT_ROUTE,
    route
  }
}

export function setCurrentChannel(selectedChannel) {
  return {
    type: SET_CURRENT_CHANNEL,
    selectedChannel
  }
}

export function setCurrentTab(currentTab) {
  return {
    type: SET_CURRENT_TAB,
    currentTab
  }
}

export function setCurrentPeer(currentPeer) {
  return {
    type: SET_CURRENT_PEER,
    currentPeer
  }
}

export function updatePayReq(pay_req) {
  return {
    type: UPDATE_PAY_REQ,
    pay_req
  }
}

export function updateSelectedPeers(peer) {
  return {
    type: UPDATE_SELECTED_PEERS,
    peer
  }
}

export function updateSelectedChannels(channel) {
  return {
    type: UPDATE_SELECTED_CHANNELS,
    channel
  }
}

// Send IPC event for describeNetwork
export const fetchDescribeNetwork = () => (dispatch) => {
  dispatch(getDescribeNetwork())
  ipcRenderer.send('lnd', { msg: 'describeNetwork' })
}

// Receive IPC event for describeNetwork
export const receiveDescribeNetwork = (event, { nodes, edges }) => dispatch => dispatch({ type: RECEIVE_DESCRIBE_NETWORK, nodes, edges })

export const queryRoutes = (pubkey, amount) => (dispatch) => {
  dispatch(getQueryRoutes(pubkey))
  ipcRenderer.send('lnd', { msg: 'queryRoutes', data: { pubkey, amount } })
}

export const receiveQueryRoutes = (event, { routes }) => dispatch => dispatch({ type: RECEIVE_QUERY_ROUTES, routes })

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [GET_DESCRIBE_NETWORK]: state => ({ ...state, networkLoading: true }),
  [RECEIVE_DESCRIBE_NETWORK]: (state, { nodes, edges }) => ({ ...state, networkLoading: false, nodes, edges }),

  [GET_QUERY_ROUTES]: (state, { pubkey }) => ({ ...state, networkLoading: true, selectedNode: { pubkey, routes: [], currentRoute: {} } }),
  [RECEIVE_QUERY_ROUTES]: (state, { routes }) => (
    {
      ...state,
      networkLoading: false,
      selectedNode: { pubkey: state.selectedNode.pubkey, routes, currentRoute: routes[0] }
    }
  ),

  [SET_CURRENT_ROUTE]: (state, { route }) => (
    {
      ...state,
      selectedNode: { pubkey: state.selectedNode.pubkey, routes: state.selectedNode.routes, currentRoute: route }
    }
  ),

  [SET_CURRENT_CHANNEL]: (state, { selectedChannel }) => ({ ...state, selectedChannel }),
  
  [SET_CURRENT_TAB]: (state, { currentTab }) => ({ ...state, currentTab }),
  
  [SET_CURRENT_PEER]: (state, { currentPeer }) => ({ ...state, currentPeer }),

  [UPDATE_PAY_REQ]: (state, { pay_req }) => ({ ...state, pay_req }),
  
  [UPDATE_SELECTED_PEERS]: (state, { peer }) => {
    let selectedPeers
    
    if (state.selectedPeers.includes(peer)) {
      selectedPeers = state.selectedPeers.filter(selectedPeer => selectedPeer.pub_key !== peer.pub_key)
    }

    if (!state.selectedPeers.includes(peer)) {
      selectedPeers = [...state.selectedPeers, peer]
    }

    return {
      ...state, selectedPeers
    }
  },

  [UPDATE_SELECTED_CHANNELS]: (state, { channel }) => {
    let selectedChannels
    
    if (state.selectedChannels.includes(channel)) {
      selectedChannels = state.selectedChannels.filter(selectedChannel => selectedChannel.chan_id !== channel.chan_id)
    }

    if (!state.selectedChannels.includes(channel)) {
      selectedChannels = [...state.selectedChannels, channel]
    }

    return {
      ...state, selectedChannels
    }
  }
}

// ------------------------------------
// Selectors
// ------------------------------------
const networkSelectors = {}
const currentRouteSelector = state => state.network.selectedNode.currentRoute
const selectedPeers = state => state.network.selectedPeers
const selectedChannels = state => state.network.selectedChannels

networkSelectors.currentRouteHopChanIds = createSelector(
  currentRouteSelector,
  (currentRoute) => {
    if (!currentRoute.hops) { return [] }

    return currentRoute.hops.map(hop => hop.chan_id)
  }
)

networkSelectors.selectedPeerPubkeys = createSelector(
  selectedPeers,
  peers => peers.map(peer => peer.pub_key)
)

networkSelectors.selectedChannelIds = createSelector(
  selectedChannels,
  channels => channels.map(channel => channel.chan_id)
)

export { networkSelectors }

// ------------------------------------
// Initial State
// ------------------------------------
const initialState = {
  networkLoading: false,
  nodes: [],
  edges: [],
  selectedNode: {
    pubkey: '',
    routes: [],
    currentRoute: {}
  },
  selectedChannel: {},
  
  currentTab: 1,

  currentPeer: {},

  pay_req: '',

  selectedPeers: [],
  selectedChannels: []
}


// ------------------------------------
// Reducer
// ------------------------------------
export default function activityReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
