import { createSelector } from 'reselect'
import filter from 'lodash/filter'
import isEmpty from 'lodash/isEmpty'

import { tickerSelectors } from './ticker'
import { btc } from '../utils'

// Initial State
const initialState = {
  // this determines whether or not the network side bar is in search state for a peer or not
  isOpen: false,
  // this determines what form (manual or submit) the user currently has open
  // if this is not null the ChannelForm component will be open
  formType: null,

  searchQuery: '',
  manualSearchQuery: '',
  contactCapacity: 0.1,
  node: {},
  showErrors: {
    manualInput: false
  },

  manualFormOpen: false,
  submitChannelFormOpen: false,

  showCurrencyFilters: false
}

// Constants
// ------------------------------------
export const OPEN_CONTACTS_FORM = 'OPEN_CONTACTS_FORM'
export const CLOSE_CONTACTS_FORM = 'CLOSE_CONTACTS_FORM'

export const OPEN_CHANNEL_FORM_FORM = 'OPEN_CHANNEL_FORM_FORM'
export const CLOSE_CHANNEL_FORM_FORM = 'CLOSE_CHANNEL_FORM_FORM'

export const SET_CHANNEL_FORM_TYPE = 'SET_CHANNEL_FORM_TYPE'

export const OPEN_MANUAL_FORM = 'OPEN_MANUAL_FORM'
export const CLOSE_MANUAL_FORM = 'CLOSE_MANUAL_FORM'

export const OPEN_SUBMIT_CHANNEL_FORM = 'OPEN_SUBMIT_CHANNEL_FORM'
export const CLOSE_SUBMIT_CHANNEL_FORM = 'CLOSE_SUBMIT_CHANNEL_FORM'

export const SET_NODE = 'SET_NODE'

export const UPDATE_CONTACT_FORM_SEARCH_QUERY = 'UPDATE_CONTACT_FORM_SEARCH_QUERY'

export const UPDATE_CONTACT_CAPACITY = 'UPDATE_CONTACT_CAPACITY'

export const UPDATE_MANUAL_FORM_ERRORS = 'UPDATE_MANUAL_FORM_ERRORS'

export const UPDATE_MANUAL_FORM_SEARCH_QUERY = 'UPDATE_MANUAL_FORM_SEARCH_QUERY'

export const SET_CONTACTS_CURRENCY_FILTERS = 'SET_CONTACTS_CURRENCY_FILTERS'

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

export function setChannelFormType(formType) {
  return {
    type: SET_CHANNEL_FORM_TYPE,
    formType
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

export function setNode(node) {
  return {
    type: SET_NODE,
    node
  }
}

export function updateManualFormErrors(errorsObject) {
  return {
    type: UPDATE_MANUAL_FORM_ERRORS,
    errorsObject
  }
}

export function setContactsCurrencyFilters(showCurrencyFilters) {
  return {
    type: SET_CONTACTS_CURRENCY_FILTERS,
    showCurrencyFilters
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [OPEN_CONTACTS_FORM]: state => ({ ...state, isOpen: true }),
  [CLOSE_CONTACTS_FORM]: state => ({ ...state, isOpen: false }),

  [SET_CHANNEL_FORM_TYPE]: (state, { formType }) => ({ ...state, formType }),

  [OPEN_MANUAL_FORM]: state => ({ ...state, manualFormOpen: true }),
  [CLOSE_MANUAL_FORM]: state => ({ ...state, manualFormOpen: false }),

  [OPEN_SUBMIT_CHANNEL_FORM]: state => ({ ...state, submitChannelFormOpen: true }),
  [CLOSE_SUBMIT_CHANNEL_FORM]: state => ({ ...state, submitChannelFormOpen: false }),

  [UPDATE_CONTACT_FORM_SEARCH_QUERY]: (state, { searchQuery }) => ({ ...state, searchQuery }),

  [UPDATE_MANUAL_FORM_SEARCH_QUERY]: (state, { searchQuery }) => ({ ...state, searchQuery }),

  [UPDATE_CONTACT_CAPACITY]: (state, { contactCapacity }) => ({ ...state, contactCapacity }),

  [SET_NODE]: (state, { node }) => ({ ...state, node }),

  [UPDATE_MANUAL_FORM_ERRORS]: (state, { errorsObject }) => ({ ...state, showErrors: Object.assign(state.showErrors, errorsObject) }),

  [UPDATE_MANUAL_FORM_SEARCH_QUERY]: (state, { manualSearchQuery }) => ({ ...state, manualSearchQuery }),

  [SET_CONTACTS_CURRENCY_FILTERS]: (state, { showCurrencyFilters }) => ({ ...state, showCurrencyFilters })
}

// ------------------------------------
// Selector
// ------------------------------------
const contactFormSelectors = {}
const networkNodesSelector = state => state.network.nodes
const searchQuerySelector = state => state.contactsform.searchQuery
const manualSearchQuerySelector = state => state.contactsform.manualSearchQuery
const contactCapacitySelector = state => state.contactsform.contactCapacity
const currencySelector = state => state.ticker.currency

const contactable = node => (
  node.addresses.length > 0
)

// comparator to sort the contacts list with contactable contacts first
const contactableFirst = (a, b) => {
  if (contactable(a) && !contactable(b)) {
    return -1
  } else if (!contactable(a) && contactable(b)) {
    return 1
  }
  return 0
}

contactFormSelectors.filteredNetworkNodes = createSelector(
  networkNodesSelector,
  searchQuerySelector,
  (nodes, searchQuery) => {
    // If there is no search query default to showing the first 20 nodes from the nodes array
    // (performance hit to render the entire thing by default)
    // if (!searchQuery.length) { return nodes.sort(contactableFirst).slice(0, 20) }

    // return an empty array if there is no search query
    if (!searchQuery.length) { return [] }

    // if there is an '@' in the search query we are assuming they are using the format pubkey@host
    // we can ignore the '@' and the host and just grab the pubkey for our search
    const query = searchQuery.includes('@') ? searchQuery.split('@')[0] : searchQuery

    // list of the nodes
    const list = filter(nodes, node => node.alias.includes(query) || node.pub_key.includes(query)).sort(contactableFirst)

    // if we don't limit the nodes returned then we take a huge performance hit
    // rendering thousands of nodes potentially, so we just render 20 for the time being
    return list.slice(0, 20)
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

contactFormSelectors.contactFormUsdAmount = createSelector(
  contactCapacitySelector,
  currencySelector,
  tickerSelectors.currentTicker,
  (amount, currency, ticker) => {
    if (!ticker || !ticker.price_usd) { return false }

    return btc.convert(currency, 'usd', amount, ticker.price_usd)
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
