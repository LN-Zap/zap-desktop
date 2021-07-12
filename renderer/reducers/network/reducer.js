import createReducer from '@zap/utils/createReducer'
import { grpc } from 'workers'

import * as constants from './constants'
import { mergeNodeUpdates } from './utils'

const { GET_DESCRIBE_NETWORK, RECEIVE_DESCRIBE_NETWORK, UPDATE_NODE_DATA } = constants

/**
 * @typedef Node
 * @property {number} lastUpdate Last known node update time
 * @property {string} pubKey Node identity pubkey
 * @property {string} alias Node alias
 * @property {object[]} addresses Node's public addresses
 * @property {string} color Color assigend to the node
 * @property {object} features Features enabled on the node
 */

/**
 * @typedef State
 * @property {boolean} networkLoading Boolean indicating if transactions are loading
 * @property {Node[]} nodes List of transactions
 */

// ------------------------------------
// Initial State
// ------------------------------------

/** @type {State} */
const initialState = {
  networkLoading: false,
  nodes: [],
}

// ------------------------------------
// Actions
// ------------------------------------

/**
 * updateNodeData - Update node data.
 * Debounced to reduce frequency of state changes.
 *
 * @param {Node[]} nodes List of nodes to update
 * @returns {object} Action
 */
export const updateNodeData = nodes => {
  return {
    type: UPDATE_NODE_DATA,
    data: nodes,
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
export const getDescribeNetwork = () => {
  return {
    type: GET_DESCRIBE_NETWORK,
  }
}

/**
 * receiveDescribeNetwork - Receive network data.
 *
 * @param {Node[]} nodes List of nodes describing the network topology
 * @returns {(dispatch:Function) => void} Thunk
 */
export const receiveDescribeNetwork = nodes => dispatch => {
  dispatch({
    type: RECEIVE_DESCRIBE_NETWORK,
    nodes,
  })
}

/**
 * fetchDescribeNetwork - Fetch network data.
 *
 * @returns {(dispatch:Function) => Promise<void>} Thunk
 */
export const fetchDescribeNetwork = () => async dispatch => {
  dispatch(getDescribeNetwork())
  const { nodes } = await grpc.services.Lightning.describeGraph()
  dispatch(receiveDescribeNetwork(nodes))
}

// ------------------------------------
// Action Handlers
// ------------------------------------

const ACTION_HANDLERS = {
  [UPDATE_NODE_DATA]: (state, { data: nodes }) => nodes.flat().reduce(mergeNodeUpdates, state),
  [GET_DESCRIBE_NETWORK]: state => {
    state.networkLoading = true
  },
  [RECEIVE_DESCRIBE_NETWORK]: (state, { nodes }) => {
    state.networkLoading = false
    state.nodes = nodes
  },
}

export default createReducer(initialState, ACTION_HANDLERS)
