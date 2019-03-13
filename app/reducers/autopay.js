import { createSelector } from 'reselect'
import { contactFormSelectors } from './contactsform'

// Initial State
const initialState = {
  searchQuery: null,
  merchants: [],
}

// Constants
// ------------------------------------
export const UPDATE_AUTOPAY_SEARCH_QUERY = 'UPDATE_AUTOPAY_SEARCH_QUERY'

// ------------------------------------
// Actions
// ------------------------------------
export function updateAutopaySearchQuery(searchQuery) {
  return {
    type: UPDATE_AUTOPAY_SEARCH_QUERY,
    searchQuery,
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [UPDATE_AUTOPAY_SEARCH_QUERY]: (state, { searchQuery }) => ({ ...state, searchQuery }),
}

// ------------------------------------
// Selector
// ------------------------------------
const autopaySelectors = {}
autopaySelectors.searchQuery = state => state.autopay.searchQuery
autopaySelectors.merchants = state => contactFormSelectors.suggestedNodes(state)

autopaySelectors.filteredMerchants = createSelector(
  autopaySelectors.merchants,
  autopaySelectors.searchQuery,
  (merchants, searchQuery) => {
    if (!searchQuery) {
      return merchants
    }
    const cleanedSearchQuery = searchQuery.toLowerCase()
    return merchants.filter(m => m.nickname.toLowerCase().includes(cleanedSearchQuery))
  }
)

export { autopaySelectors }

// ------------------------------------
// Reducer
// ------------------------------------
export default function autopayReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
