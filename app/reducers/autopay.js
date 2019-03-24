import { createSelector } from 'reselect'
import { contactFormSelectors } from './contactsform'

// Initial State
const initialState = {
  isCreateModalOpen: false,
  searchQuery: null,
  merchants: [],
  list: {}, // current enabled autopay entries
}

// Constants
// ------------------------------------
export const UPDATE_AUTOPAY_SEARCH_QUERY = 'UPDATE_AUTOPAY_SEARCH_QUERY'
export const OPEN_AUTOPAY_CREATE_MODAL = 'OPEN_AUTOPAY_CREATE_MODAL'
export const CLOSE_AUTOPAY_CREATE_MODAL = 'CLOSE_AUTOPAY_CREATE_MODAL'

export const SET_SELECTED_MERCHANT = 'SET_SELECTED_MERCHANT'
export const ENABLE_AUTOPAY = 'ENABLE_AUTOPAY'
export const SET_AUTOPAY_LIST = 'SET_AUTOPAY_LIST'

// ------------------------------------
// Actions
// ------------------------------------
export function enableAutopay(merchantId, limit) {
  return async dispatch => {
    await window.db.autopay.put({ id: merchantId, limit })
    return dispatch({
      type: ENABLE_AUTOPAY,
      data: { merchantId, limit },
    })
  }
}

export function setAutopayList(list) {
  return {
    type: SET_AUTOPAY_LIST,
    list,
  }
}

export function initAutopay() {
  return async dispatch => {
    let autopayList
    try {
      autopayList = await window.db.autopay.toArray()
    } catch (e) {
      autopayList = []
    }
    dispatch(setAutopayList(autopayList))
    return autopayList
  }
}

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

/**
 * Adds or replaces (if it already exists) autopay entry
 */
function addAutopayEntry(state, { data }) {
  const { list } = state
  const { merchantId, limit } = data
  return {
    ...state,
    list: { ...list, [merchantId]: { limit } },
  }
}

function setAutopayListFromArray(state, { list }) {
  const mapped = list.reduce((acc, next) => {
    acc[next.id] = next
    return acc
  }, {})
  return {
    ...state,
    list: mapped,
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [UPDATE_AUTOPAY_SEARCH_QUERY]: (state, { searchQuery }) => ({ ...state, searchQuery }),
  [SET_SELECTED_MERCHANT]: (state, { selectedMerchantId }) => ({ ...state, selectedMerchantId }),
  [ENABLE_AUTOPAY]: addAutopayEntry,
  [SET_AUTOPAY_LIST]: setAutopayListFromArray,
}

// ------------------------------------
// Selector
// ------------------------------------
const autopaySelectors = {}
autopaySelectors.searchQuery = state => state.autopay.searchQuery
autopaySelectors.autopayList = state => state.autopay.list
autopaySelectors.isCreateModalOpen = state => state.autopay.isCreateModalOpen
autopaySelectors.selectedMerchantId = state => state.autopay.selectedMerchantId
autopaySelectors.merchants = state => contactFormSelectors.suggestedNodes(state)

autopaySelectors.selectedMerchant = createSelector(
  autopaySelectors.merchants,
  autopaySelectors.selectedMerchantId,
  autopaySelectors.autopayList,
  (merchants, selectedMerchantId, autopayList) => {
    const selectedMerchant = merchants.find(m => m.pubkey === selectedMerchantId)
    return (
      selectedMerchant && {
        ...selectedMerchant,
        isActive: [selectedMerchant.pubkey] in autopayList,
      }
    )
  }
)
autopaySelectors.filteredMerchants = createSelector(
  autopaySelectors.merchants,
  autopaySelectors.searchQuery,
  autopaySelectors.autopayList,
  (merchants, searchQuery, autopayList) => {
    const addIsActive = m => ({ ...m, isActive: [m.pubkey] in autopayList })
    if (!searchQuery) {
      return merchants.map(addIsActive)
    }
    const cleanedSearchQuery = searchQuery.toLowerCase()
    return merchants
      .filter(m => m.nickname.toLowerCase().includes(cleanedSearchQuery))
      .map(addIsActive)
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
