import get from 'lodash.get'
import { createSelector } from 'reselect'
import partition from 'lodash.partition'
import { btc } from 'lib/utils'
import { tickerSelectors } from './ticker'

// Initial State
const initialState = {
  // this determines whether or not the network side bar is in search state for a peer or not
  isOpen: false,
  // this determines what form (manual or submit) the user currently has open
  // if this is not null the ChannelForm component will be open
  formType: null,

  searchQuery: null,
  node: {},
  manualFormOpen: false,
  submitChannelFormOpen: false
}

// Constants
// ------------------------------------
export const OPEN_CONTACTS_FORM = 'OPEN_CONTACTS_FORM'
export const CLOSE_CONTACTS_FORM = 'CLOSE_CONTACTS_FORM'

export const OPEN_CHANNEL_FORM_FORM = 'OPEN_CHANNEL_FORM_FORM'
export const CLOSE_CHANNEL_FORM_FORM = 'CLOSE_CHANNEL_FORM_FORM'

export const OPEN_MANUAL_FORM = 'OPEN_MANUAL_FORM'
export const CLOSE_MANUAL_FORM = 'CLOSE_MANUAL_FORM'

export const OPEN_SUBMIT_CHANNEL_FORM = 'OPEN_SUBMIT_CHANNEL_FORM'
export const CLOSE_SUBMIT_CHANNEL_FORM = 'CLOSE_SUBMIT_CHANNEL_FORM'

export const SET_NODE = 'SET_NODE'

export const UPDATE_CONTACT_FORM_SEARCH_QUERY = 'UPDATE_CONTACT_FORM_SEARCH_QUERY'

// ------------------------------------
// Actions
// ------------------------------------
export function openContactsForm() {
  return {
    type: OPEN_CONTACTS_FORM
  }
}

export function closeContactsForm() {
  return dispatch => {
    //clear search on close
    dispatch(updateContactFormSearchQuery(''))
    dispatch({
      type: CLOSE_CONTACTS_FORM
    })
  }
}

export function openChannelForm() {
  return {
    type: OPEN_CONTACTS_FORM
  }
}

export function closeChannelForm() {
  return {
    type: CLOSE_CONTACTS_FORM
  }
}

export function openManualForm() {
  return {
    type: OPEN_MANUAL_FORM
  }
}

export function closeManualForm() {
  return {
    type: CLOSE_MANUAL_FORM
  }
}

export function openSubmitChannelForm() {
  return {
    type: OPEN_SUBMIT_CHANNEL_FORM
  }
}

export function closeSubmitChannelForm() {
  return {
    type: CLOSE_SUBMIT_CHANNEL_FORM
  }
}

export function updateContactFormSearchQuery(searchQuery) {
  return {
    type: UPDATE_CONTACT_FORM_SEARCH_QUERY,
    searchQuery
  }
}

export function setNode(node) {
  return {
    type: SET_NODE,
    node
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [OPEN_CONTACTS_FORM]: state => ({ ...state, isOpen: true }),
  [CLOSE_CONTACTS_FORM]: state => ({ ...state, isOpen: false }),

  [OPEN_MANUAL_FORM]: state => ({
    ...state,
    manualFormOpen: true,
    formType: 'MANUAL_FORM'
  }),
  [CLOSE_MANUAL_FORM]: state => ({ ...state, manualFormOpen: false, formType: null }),

  [OPEN_SUBMIT_CHANNEL_FORM]: state => ({
    ...state,
    submitChannelFormOpen: true,
    formType: 'SUBMIT_CHANNEL_FORM'
  }),
  [CLOSE_SUBMIT_CHANNEL_FORM]: state => ({
    ...state,
    submitChannelFormOpen: false,
    formType: null
  }),

  [UPDATE_CONTACT_FORM_SEARCH_QUERY]: (state, { searchQuery }) => ({ ...state, searchQuery }),

  [SET_NODE]: (state, { node }) => ({ ...state, node })
}

// ------------------------------------
// Selector
// ------------------------------------
const contactFormSelectors = {}
const networkNodesSelector = state => state.network.nodes
const searchQuerySelector = state => state.contactsform.searchQuery
const currencySelector = state => state.ticker.currency
const nodeSelector = state => state.contactsform.node
const channelsSelector = state => state.channels.channels
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

contactFormSelectors.filteredNetworkNodes = createSelector(
  networkNodesSelector,
  searchQuerySelector,
  peersSelector,
  (nodes, searchQuery, peers) => {
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

    // list of the nodes
    return nodes
      .filter(node => {
        const { alias, pub_key, addresses } = node
        const matchesSearch =
          (alias && alias.includes(query)) || (pub_key && pub_key.includes(query))
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

contactFormSelectors.showManualForm = createSelector(
  searchQuerySelector,
  contactFormSelectors.filteredNetworkNodes,
  (searchQuery, filteredNetworkNodes) => {
    const connectableNodes = filteredNetworkNodes.filter(node => node.addresses.length > 0)

    if (!filteredNetworkNodes.length || !connectableNodes.length) {
      return true
    }

    return false
  }
)

// compose warning info when a channel is being created with a node that
// already has one or more active channels open
contactFormSelectors.dupeChanInfo = createSelector(
  channelsSelector,
  nodeSelector,
  networkNodesSelector,
  currencySelector,
  tickerSelectors.currencyName,
  (activeChannels, newNode, allNodes, currency, currencyName) => {
    const chans = activeChannels.filter(
      chan => chan.active && chan.remote_pubkey === newNode.pub_key
    )

    if (!chans.length) {
      return null
    }

    const node = allNodes.filter(node => node.pub_key === newNode.pub_key)[0]
    // use the alias unless its the first 20 chars of the pub_key
    const alias =
      node && node.alias !== node.pub_key.substring(0, node.alias.length) ? node.alias : null

    const totalSats = chans.reduce((agg, chan) => agg + parseInt(chan.capacity, 10), 0)
    const capacity = parseFloat(btc.convert('sats', currency, totalSats))

    return {
      alias,
      activeChannels: chans.length,
      capacity,
      currencyName
    }
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
