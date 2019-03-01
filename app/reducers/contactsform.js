import get from 'lodash.get'
import { createSelector } from 'reselect'
import partition from 'lodash.partition'
import { getNodeDisplayName, truncateNodePubkey } from './network'

// Initial State
const initialState = {
  searchQuery: null
}

// Constants
// ------------------------------------
export const UPDATE_CONTACT_FORM_SEARCH_QUERY = 'UPDATE_CONTACT_FORM_SEARCH_QUERY'

// ------------------------------------
// Actions
// ------------------------------------
export function updateContactFormSearchQuery(searchQuery) {
  return {
    type: UPDATE_CONTACT_FORM_SEARCH_QUERY,
    searchQuery
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [UPDATE_CONTACT_FORM_SEARCH_QUERY]: (state, { searchQuery }) => ({ ...state, searchQuery })
}

// ------------------------------------
// Selector
// ------------------------------------
const contactFormSelectors = {}
const networkNodesSelector = state => state.network.nodes
const searchQuerySelector = state => state.contactsform.searchQuery
const peersSelector = state => state.peers.peers
const contactable = node => node.addresses.length > 0
const networkSelector = state => state.info.network
const chainSelector = state => state.info.chain
const suggestedNodesSelector = state => state.channels.suggestedNodes

// comparator to sort the contacts list with contactable contacts first
const contactableFirst = (a, b) => {
  if (contactable(a) && !contactable(b)) {
    return -1
  } else if (!contactable(a) && contactable(b)) {
    return 1
  }
  return 0
}

contactFormSelectors.suggestedNodes = createSelector(
  chainSelector,
  networkSelector,
  suggestedNodesSelector,
  (chain, network, suggestedNodes) => {
    return get(suggestedNodes, `${chain}.${network}`, [])
  }
)

/**
 * @param {array} suggestedNodes
 * @return search results compatible version of suggested nodes array
 */
const fromSuggestedToRegular = suggestedNodes =>
  suggestedNodes &&
  suggestedNodes.map(node => ({
    ...node,
    addresses: [{ addr: node.host }]
  }))
contactFormSelectors.filteredNetworkNodes = createSelector(
  networkNodesSelector,
  searchQuerySelector,
  peersSelector,
  contactFormSelectors.suggestedNodes,
  (nodes, searchQuery, peers, suggestedNodes) => {
    const LIMIT = 50

    // If there is no search query default to showing the first 50 nodes from the nodes array
    // (performance hit to render the entire thing by default)
    if (!searchQuery) {
      const peerPubKeys = peers.map(peer => peer.pub_key)
      const [peerNodes, nonPeerNodes] = partition(nodes, node => peerPubKeys.includes(node.pub_key))
      return peerNodes
        .concat(nonPeerNodes)
        .sort(contactableFirst)
        .slice(0, LIMIT)
    }

    // if there is an '@' in the search query we are assuming they are using the format pubkey@host
    // we can ignore the '@' and the host and just grab the pubkey for our search
    const query = searchQuery.includes('@') ? searchQuery.split('@')[0] : searchQuery
    const queryLowerCase = query && query.toLowerCase()
    // list of the nodes
    return nodes
      .concat(fromSuggestedToRegular(suggestedNodes) || [])
      .filter(node => {
        const { alias, pub_key, addresses } = node
        const matchesSearch =
          (alias && alias.toLowerCase().includes(queryLowerCase)) ||
          (pub_key && pub_key.includes(queryLowerCase))
        const hasAddress = addresses.length > 0
        return matchesSearch && hasAddress
      })
      .sort(contactableFirst)
      .slice(0, LIMIT)
  }
)

contactFormSelectors.isSearchValidNodeAddress = createSelector(
  searchQuerySelector,
  searchQuery => {
    if (!searchQuery || searchQuery.length < 3) {
      return false
    }
    const [pubkey, host] = searchQuery.split('@')
    return Boolean(pubkey && host)
  }
)

contactFormSelectors.selectedNodeDisplayName = createSelector(
  searchQuerySelector,
  contactFormSelectors.isSearchValidNodeAddress,
  networkNodesSelector,
  (searchQuery, isSearchValidNodeAddress, nodes) => {
    if (isSearchValidNodeAddress) {
      const pubkey = searchQuery.split('@')[0]
      const node = nodes.find(n => n.pub_key === pubkey)
      return node ? getNodeDisplayName(node) : truncateNodePubkey(pubkey)
    }
    return null
  }
)

export { contactFormSelectors }

// ------------------------------------
// Reducer
// ------------------------------------
export default function contactFormReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
