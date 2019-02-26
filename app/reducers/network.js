import { send } from 'redux-electron-ipc'

// ------------------------------------
// Constants
// ------------------------------------
export const GET_DESCRIBE_NETWORK = 'GET_DESCRIBE_NETWORK'
export const RECEIVE_DESCRIBE_NETWORK = 'RECEIVE_DESCRIBE_NETWORK'
export const UPDATE_NODE_DATA = 'UPDATE_NODE_DATA'

// ------------------------------------
// Helpers
// ------------------------------------

export const getNodeDisplayName = node => {
  if (node && node.alias && node.alias.length) {
    return node.alias
  }

  return truncateNodePubkey(node.pub_key)
}

export const truncateNodePubkey = pubkey => pubkey.substring(0, 10)

// ------------------------------------
// Actions
// ------------------------------------
export function updateNodeData(nodeData) {
  return {
    type: UPDATE_NODE_DATA,
    nodeData
  }
}

export function getDescribeNetwork() {
  return {
    type: GET_DESCRIBE_NETWORK
  }
}

// Send IPC event for describeNetwork
export const fetchDescribeNetwork = () => dispatch => {
  dispatch(getDescribeNetwork())
  dispatch(send('lnd', { msg: 'describeNetwork' }))
}

// Receive IPC event for describeNetwork
export const receiveDescribeNetwork = (event, { nodes, edges }) => dispatch =>
  dispatch({ type: RECEIVE_DESCRIBE_NETWORK, nodes, edges })

// ------------------------------------
// Helpers
// ------------------------------------
const mergeNodeUpdates = (state, nodeData) => {
  const { nodes: originalNodes } = state
  // Check if this is an existing node
  const index = originalNodes.findIndex(item => item.pub_key === nodeData.identity_key)
  // If we didn't find the node, add it to the end of the nodes list.
  // Otherwise update existing.
  const nodes =
    index < 0
      ? [...originalNodes, nodeData]
      : [
          ...originalNodes.slice(0, index),
          {
            ...originalNodes[index],
            ...nodeData,
            last_update: Math.round(new Date() / 1000)
          },
          ...originalNodes.slice(index + 1)
        ]

  return {
    ...state,
    nodes
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [UPDATE_NODE_DATA]: (state, { nodeData }) => nodeData.reduce(mergeNodeUpdates, state),
  [GET_DESCRIBE_NETWORK]: state => ({ ...state, networkLoading: true }),
  [RECEIVE_DESCRIBE_NETWORK]: (state, { nodes, edges }) => ({
    ...state,
    networkLoading: false,
    nodes,
    edges
  })
}

// ------------------------------------
// Initial State
// ------------------------------------
const initialState = {
  networkLoading: false,
  nodes: [],
  edges: []
}

// ------------------------------------
// Reducer
// ------------------------------------
export default function activityReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
