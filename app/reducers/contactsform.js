import { createSelector } from 'reselect'

import filter from 'lodash/filter'

// Initial State
const initialState = {
  isOpen: false,
  searchQuery: '',
  contactCapacity: 0.1
}

// Constants
// ------------------------------------
export const OPEN_CONTACTS_FORM = 'OPEN_CONTACTS_FORM'
export const CLOSE_CONTACTS_FORM = 'CLOSE_CONTACTS_FORM'

export const UPDATE_CONTACT_FORM_SEARCH_QUERY = 'UPDATE_CONTACT_FORM_SEARCH_QUERY'

export const UPDATE_CONTACT_CAPACITY = 'UPDATE_CONTACT_CAPACITY'

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

export function updateContactCapacity(contactCapacity) {
  return {
    type: UPDATE_CONTACT_CAPACITY,
    contactCapacity
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [OPEN_CONTACTS_FORM]: state => ({ ...state, isOpen: true }),
  [CLOSE_CONTACTS_FORM]: state => ({ ...state, isOpen: false }),

  [UPDATE_CONTACT_FORM_SEARCH_QUERY]: (state, { searchQuery }) => ({ ...state, searchQuery }),

  [UPDATE_CONTACT_CAPACITY]: (state, { contactCapacity }) => ({ ...state, contactCapacity })
}

// ------------------------------------
// Selector
// ------------------------------------
const contactFormSelectors = {}
const networkNodesSelector = state => state.network.nodes
const searchQuerySelector = state => state.contactsform.searchQuery


contactFormSelectors.filteredNetworkNodes = createSelector(
  networkNodesSelector,
  searchQuerySelector,
  (nodes, searchQuery) => filter(nodes, node => node.alias.includes(searchQuery) || node.pub_key.includes(searchQuery))
)

export { contactFormSelectors }

// ------------------------------------
// Reducer
// ------------------------------------
export default function contactFormReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
