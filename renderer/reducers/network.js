import { createSelector } from 'reselect'
import { grpc } from 'workers'
import createReducer from '@zap/utils/createReducer'
import truncateNodePubkey from '@zap/utils/truncateNodePubkey'

// ------------------------------------
// Initial State
// ------------------------------------

const initialState = {
  networkLoading: false,
  nodes: [],
}

// ------------------------------------
// Constants
// ------------------------------------

export const GET_DESCRIBE_NETWORK = 'GET_DESCRIBE_NETWORK'
export const RECEIVE_DESCRIBE_NETWORK = 'RECEIVE_DESCRIBE_NETWORK'
export const UPDATE_NODE_DATA = 'UPDATE_NODE_DATA'

// ------------------------------------
// Helpers
// ------------------------------------

/**
 * mergeNodeUpdate - Merge node update into the state.
 * Updates existing entry or adds to the end of the list.
 *
 * @param  {object} state State
 * @param  {object} nodeData Node data
 * @returns {object} Updated state
 */
const mergeNodeUpdates = (state, nodeData) => {
  const { nodes } = state
  // Check if this is an existing node
  const index = nodes.findIndex(item => item.pub_key === nodeData.identity_key)
  // If we didn't find the node, add it to the end of the nodes list.
  // Otherwise update existing.
  if (index < 0) {
    nodes.push(nodeData)
  } else {
    nodes[index] = { ...nodes[index], ...nodeData, last_update: Math.round(new Date() / 1000) }
  }

  return state
}

/**
 * getNodeDisplayName - Get display name for a node.
 * Use alias if set, otherwise use a truncated version of the node pubkey.
 *
 * @param  {object} node Node
 * @returns {string} Display name
 */
export const getNodeDisplayName = node => {
  if (node && node.alias && node.alias.length) {
    return node.alias
  }

  return truncateNodePubkey(node.pub_key)
}

// ------------------------------------
// Actions
// ------------------------------------

/**
 * updateNodeData - Update node data
 * Debounced to reduce frequency of state changes.
 *
 * @param  {Array} data List of nodes to update
 * @returns {string} Display name
 */
export function updateNodeData(data) {
  return {
    type: UPDATE_NODE_DATA,
    data,
    // enable debounce for this action
    debounce: {
      wait: 2000,
      maxWait: 5000,
    },
  }
}

/**
 * getDescribeNetwork - Initiate call to fetch network data.
 *
 * @returns {object} Action
 */
export function getDescribeNetwork() {
  return {
    type: GET_DESCRIBE_NETWORK,
  }
}

/**
 * fetchDescribeNetwork - Fetch network data.
 *
 * @returns {object} Action
 */
export const fetchDescribeNetwork = () => async dispatch => {
  dispatch(getDescribeNetwork())
  const data = await grpc.services.Lightning.describeGraph()
  dispatch(receiveDescribeNetwork(data))
}

/**
 * receiveDescribeNetwork - Receive network data.
 *
 * @param {{ nodes }} nodes List of nodes describing the network topology
 * @returns {object} Action
 */
export const receiveDescribeNetwork = ({ nodes }) => dispatch =>
  dispatch({ type: RECEIVE_DESCRIBE_NETWORK, nodes })

// ------------------------------------
// Action Handlers
// ------------------------------------

const ACTION_HANDLERS = {
  [UPDATE_NODE_DATA]: (state, { data }) => data.flat().reduce(mergeNodeUpdates, state),
  [GET_DESCRIBE_NETWORK]: state => {
    state.networkLoading = true
  },
  [RECEIVE_DESCRIBE_NETWORK]: (state, { nodes }) => {
    state.networkLoading = false
    state.nodes = nodes
  },
}

// ------------------------------------
// Selectors
// ------------------------------------

const networkSelectors = {}
const nodesSelector = state => state.network.nodes

networkSelectors.nodes = createSelector(nodesSelector, nodes => nodes)

export { networkSelectors }

export default createReducer(initialState, ACTION_HANDLERS)
