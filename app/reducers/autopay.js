import { createSelector } from 'reselect'
import { contactFormSelectors } from './contactsform'

// Initial State
const initialState = {
  isCreateModalOpen: false,
  searchQuery: null,
  merchants: [],
}

// Constants
// ------------------------------------
export const UPDATE_AUTOPAY_SEARCH_QUERY = 'UPDATE_AUTOPAY_SEARCH_QUERY'
export const OPEN_AUTOPAY_CREATE_MODAL = 'OPEN_AUTOPAY_CREATE_MODAL'
export const CLOSE_AUTOPAY_CREATE_MODAL = 'CLOSE_AUTOPAY_CREATE_MODAL'

export const SET_SELECTED_MERCHANT = 'SET_SELECTED_MERCHANT'

// ------------------------------------
// Actions
// ------------------------------------
export function setSelectedMerchant(merchantId) {
  return {
    type: SET_SELECTED_MERCHANT,
    selectedMerchantId: merchantId,
  }
}

export function updateAutopaySearchQuery(searchQuery) {
  return {
    type: UPDATE_AUTOPAY_SEARCH_QUERY,
    searchQuery,
  }
}

export function openAutopayCreateModal(merchantId) {
  return dispatch => {
    dispatch(setSelectedMerchant(merchantId))
  }
}
export function closeAutopayCreateModal() {
  return dispatch => {
    dispatch(setSelectedMerchant())
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [UPDATE_AUTOPAY_SEARCH_QUERY]: (state, { searchQuery }) => ({ ...state, searchQuery }),
  [SET_SELECTED_MERCHANT]: (state, { selectedMerchantId }) => ({ ...state, selectedMerchantId }),
}

// ------------------------------------
// Selector
// ------------------------------------
const autopaySelectors = {}
autopaySelectors.searchQuery = state => state.autopay.searchQuery
autopaySelectors.isCreateModalOpen = state => state.autopay.isCreateModalOpen
autopaySelectors.selectedMerchantId = state => state.autopay.selectedMerchantId

autopaySelectors.merchants = state => contactFormSelectors.suggestedNodes(state)

autopaySelectors.selectedMerchant = createSelector(
  autopaySelectors.merchants,
  autopaySelectors.selectedMerchantId,
  (merchants, selectedMerchantId) => {
    return merchants.find(m => m.pubkey === selectedMerchantId)
  }
)
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
