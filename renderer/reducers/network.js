import { createSelector } from 'reselect'
import { grpcService } from 'workers'
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
const mergeNodeUpdate = (state, nodeData) => {
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
            last_update: Math.round(new Date() / 1000),
          },
          ...originalNodes.slice(index + 1),
        ]

  return {
    ...state,
    nodes,
  }
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
  const grpc = await grpcService
  const data = await grpc.services.Lightning.describeGraph()
  dispatch(receiveDescribeNetwork(data))
}

/**
 * receiveDescribeNetwork - Receive network data.
 *
 * @param {{ nodes }} nodes List of nodes describing the network topology
 * @returns {object} Action
 */
export const receiveDescribeNetwork = ({ nodes }) => ({
  type: RECEIVE_DESCRIBE_NETWORK,
  nodes,
})

// ------------------------------------
// Action Handlers
// ------------------------------------

const ACTION_HANDLERS = {
  [UPDATE_NODE_DATA]: (state, { data }) => data.flat().reduce(mergeNodeUpdate, state),
  [GET_DESCRIBE_NETWORK]: state => ({ ...state, networkLoading: true }),
  [RECEIVE_DESCRIBE_NETWORK]: (state, { nodes }) => ({
    ...state,
    networkLoading: false,
    nodes,
  }),
}

// ------------------------------------
// Selectors
// ------------------------------------

const networkSelectors = {}
const nodesSelector = state => state.network.nodes

networkSelectors.nodes = createSelector(
  nodesSelector,
  nodes => nodes
)

export { networkSelectors }

// ------------------------------------
// Reducer
// ------------------------------------

/**
 * networkReducer - Network reducer.
 *
 * @param  {object} state = initialState Initial state
 * @param  {object} action Action
 * @returns {object} Next state
 */
export default function networkReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
