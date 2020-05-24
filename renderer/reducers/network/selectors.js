/**
 * @typedef {import('../index').State} State
 * @typedef {import('./reducer').Node} Node
 */

/**
 * nodesSelector - List of nodes on the network.
 *
 * @param {State} state Redux state
 * @returns {Node[]} List of nodes
 */
const nodes = state => state.network.nodes

export default {
  nodes,
}
