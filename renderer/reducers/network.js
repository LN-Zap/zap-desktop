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

export const getNodeDisplayName = node => {
  if (node && node.alias && node.alias.length) {
    return node.alias
  }

  return truncateNodePubkey(node.pub_key)
}

// ------------------------------------
// Actions
// ------------------------------------

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

export function getDescribeNetwork() {
  return {
    type: GET_DESCRIBE_NETWORK,
  }
}

// Send IPC event for describeNetwork
export const fetchDescribeNetwork = () => async dispatch => {
  dispatch(getDescribeNetwork())
  const grpc = await grpcService
  const data = await grpc.services.Lightning.describeGraph()
  dispatch(receiveDescribeNetwork(data))
}

// Receive IPC event for describeNetwork
export const receiveDescribeNetwork = ({ nodes }) => dispatch =>
  dispatch({ type: RECEIVE_DESCRIBE_NETWORK, nodes })

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
            last_update: Math.round(new Date() / 1000),
          },
          ...originalNodes.slice(index + 1),
        ]

  return {
    ...state,
    nodes,
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------

const ACTION_HANDLERS = {
  [UPDATE_NODE_DATA]: (state, { data }) => data.flat().reduce(mergeNodeUpdates, state),
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
 * @returns {object} Final state
 */
export default function networkReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
