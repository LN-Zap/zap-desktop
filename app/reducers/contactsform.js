import { createSelector } from 'reselect'
import filter from 'lodash/filter'
import partition from 'lodash/partition'
import isEmpty from 'lodash/isEmpty'

// Initial State
const initialState = {
  isOpen: false,
  searchQuery: '',
  manualSearchQuery: '',
  contactCapacity: 0.1,
  showErrors: {
    manualInput: false
  }
}

// Constants
// ------------------------------------
export const OPEN_CONTACTS_FORM = 'OPEN_CONTACTS_FORM'
export const CLOSE_CONTACTS_FORM = 'CLOSE_CONTACTS_FORM'

export const UPDATE_CONTACT_FORM_SEARCH_QUERY = 'UPDATE_CONTACT_FORM_SEARCH_QUERY'

export const UPDATE_CONTACT_CAPACITY = 'UPDATE_CONTACT_CAPACITY'

export const UPDATE_MANUAL_FORM_ERRORS = 'UPDATE_MANUAL_FORM_ERRORS'

export const UPDATE_MANUAL_FORM_SEARCH_QUERY = 'UPDATE_MANUAL_FORM_SEARCH_QUERY'

// ------------------------------------
// Actions
// ------------------------------------
export function openContactsForm() {
  return {
    type: OPEN_CONTACTS_FORM
  }
}

export function closeContactsForm() {
  return {
    type: CLOSE_CONTACTS_FORM
  }
}

export function updateContactFormSearchQuery(searchQuery) {
  return {
    type: UPDATE_CONTACT_FORM_SEARCH_QUERY,
    searchQuery
  }
}

export function updateManualFormSearchQuery(manualSearchQuery) {
  return {
    type: UPDATE_MANUAL_FORM_SEARCH_QUERY,
    manualSearchQuery
  }
}

export function updateContactCapacity(contactCapacity) {
  return {
    type: UPDATE_CONTACT_CAPACITY,
    contactCapacity
  }
}

export function updateManualFormErrors(errorsObject) {
  return {
    type: UPDATE_MANUAL_FORM_ERRORS,
    errorsObject
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [OPEN_CONTACTS_FORM]: state => ({ ...state, isOpen: true }),
  [CLOSE_CONTACTS_FORM]: state => ({ ...state, isOpen: false }),

  [UPDATE_CONTACT_FORM_SEARCH_QUERY]: (state, { searchQuery }) => ({ ...state, searchQuery }),

  [UPDATE_MANUAL_FORM_SEARCH_QUERY]: (state, { searchQuery }) => ({ ...state, searchQuery }),

  [UPDATE_CONTACT_CAPACITY]: (state, { contactCapacity }) => ({ ...state, contactCapacity }),

  [UPDATE_MANUAL_FORM_ERRORS]: (state, { errorsObject }) => ({ ...state, showErrors: Object.assign(state.showErrors, errorsObject) }),

  [UPDATE_MANUAL_FORM_SEARCH_QUERY]: (state, { manualSearchQuery }) => ({ ...state, manualSearchQuery })
}

// ------------------------------------
// Selector
// ------------------------------------
const contactFormSelectors = {}
const networkNodesSelector = state => state.network.nodes
const searchQuerySelector = state => state.contactsform.searchQuery
const manualSearchQuerySelector = state => state.contactsform.manualSearchQuery
const peersSelector = state => state.peers.peers

contactFormSelectors.filteredNetworkNodes = createSelector(
  networkNodesSelector,
  searchQuerySelector,
  peersSelector,
  (nodes, searchQuery, peers) => {
    // If there is no search query default to showing the first 20 nodes from the nodes array
    // (performance hit to render the entire thing by default)
    if (!searchQuery.length) {
      const peerPubKeys = peers.map(peer => peer.pub_key)
      const [peerNodes, nonPeerNodes] = partition(nodes, node => peerPubKeys.includes(node.pub_key))
      return peerNodes.concat(nonPeerNodes.slice(0, 20 - peerNodes.length))
    }

    // if there is an '@' in the search query we are assuming they are using the format pubkey@host
    // we can ignore the '@' and the host and just grab the pubkey for our search
    const query = searchQuery.includes('@') ? searchQuery.split('@')[0] : searchQuery

    return filter(nodes, node => node.alias.includes(query) || node.pub_key.includes(query))
  }
)

contactFormSelectors.showManualForm = createSelector(
  searchQuerySelector,
  contactFormSelectors.filteredNetworkNodes,
  (searchQuery, filteredNetworkNodes) => {
    if (!searchQuery.length) { return false }

    const connectableNodes = filteredNetworkNodes.filter(node => node.addresses.length > 0)

    if (!filteredNetworkNodes.length || !connectableNodes.length) { return true }

    return false
  }
)

contactFormSelectors.manualFormIsValid = createSelector(
  manualSearchQuerySelector,
  (input) => {
    const errors = {}
    if (!input.length || !input.includes('@')) {
      errors.manualInput = 'Invalid format'
    }
    return {
      errors,
      isValid: isEmpty(errors)
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
