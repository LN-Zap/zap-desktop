import truncateNodePubkey from '@zap/utils/truncateNodePubkey'

/**
 * @typedef {import('./reducer').State} State
 * @typedef {import('./reducer').Node} Node
 */

/**
 * mergeNodeUpdate - Merge node update into the state.
 * Updates existing entry or adds to the end of the list.
 *
 * @param {State} networkState State
 * @param {Node} nodeData Node data
 * @returns {State} Updated state
 */
export const mergeNodeUpdates = (networkState, nodeData) => {
  const { nodes } = networkState
  // Check if this is an existing node
  const index = nodes.findIndex(item => item.pubKey === nodeData.identityKey)
  // If we didn't find the node, add it to the end of the nodes list.
  // Otherwise update existing.
  if (index < 0) {
    nodes.push(nodeData)
  } else {
    nodes[index] = {
      ...nodes[index],
      ...nodeData,
      lastUpdate: Math.round(new Date().getDate() / 1000),
    }
  }

  return networkState
}

/**
 * getNodeDisplayName - Get display name for a node.
 * Use alias if set, otherwise use a truncated version of the node pubkey.
 *
 * @param {Node} node Node
 * @returns {string} Display name
 */
export const getNodeDisplayName = node => {
  if (node && node.alias && node.alias.length) {
    return node.alias
  }

  return truncateNodePubkey(node.pubKey)
}
