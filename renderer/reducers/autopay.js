import { createSelector } from 'reselect'
import { contactFormSelectors } from './contactsform'
import { tickerSelectors } from './ticker'

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
export const DISABLE_AUTOPAY = 'DISABLE_AUTOPAY'
export const SET_AUTOPAY_LIST = 'SET_AUTOPAY_LIST'

export const SET_EDIT_MODE = 'SET_EDIT_MODE'
export const RESET_EDIT_MODE = 'RESET_EDIT_MODE'

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

export function disableAutopay(merchantId) {
  return async dispatch => {
    await window.db.autopay.delete(merchantId)
    return dispatch({
      type: DISABLE_AUTOPAY,
      merchantId,
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
export function resetEditMode() {
  return {
    type: RESET_EDIT_MODE,
  }
}

export function openAutopayCreateModal(merchantId, isEditMode = false) {
  return dispatch => {
    dispatch(setSelectedMerchant(merchantId))
    // set modal mode. Either we are creating a new autopay entry or
    // editing an existing one
    dispatch({
      type: SET_EDIT_MODE,
      isEditMode,
    })
  }
}
export function closeAutopayCreateModal() {
  return dispatch => {
    dispatch(setSelectedMerchant())
    dispatch(resetEditMode())
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

function removeAutopayEntry(state, { merchantId }) {
  const list = { ...state.list }
  delete list[merchantId]
  return { ...state, list }
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
  [SET_EDIT_MODE]: (state, { isEditMode }) => ({ ...state, isEditMode }),
  [RESET_EDIT_MODE]: state => {
    const newState = { ...state }
    delete newState.isEditMode
    return newState
  },
  [ENABLE_AUTOPAY]: addAutopayEntry,
  [DISABLE_AUTOPAY]: removeAutopayEntry,
  [SET_AUTOPAY_LIST]: setAutopayListFromArray,
}

// ------------------------------------
// Selector
// ------------------------------------
const autopaySelectors = {}
autopaySelectors.searchQuery = state => state.autopay.searchQuery
autopaySelectors.autopayList = state => state.autopay.list
autopaySelectors.isCreateModalOpen = state => state.autopay.isCreateModalOpen
autopaySelectors.isCreateModalEditMode = state => Boolean(state.autopay.isEditMode)
autopaySelectors.selectedMerchantId = state => state.autopay.selectedMerchantId
autopaySelectors.merchants = state => contactFormSelectors.suggestedNodes(state)

autopaySelectors.selectedMerchant = createSelector(
  autopaySelectors.merchants,
  autopaySelectors.selectedMerchantId,
  autopaySelectors.autopayList,
  (merchants, selectedMerchantId, autopayList) => {
    const selectedMerchant = merchants.find(m => m.pubkey === selectedMerchantId)
    if (!selectedMerchant) {
      return null
    }
    const { pubkey } = selectedMerchant
    const isActive = [selectedMerchant.pubkey] in autopayList
    return {
      ...selectedMerchant,
      limit: isActive ? autopayList[pubkey].limit : null,
      isActive,
    }
  }
)

autopaySelectors.filteredMerchants = createSelector(
  autopaySelectors.merchants,
  autopaySelectors.searchQuery,
  autopaySelectors.autopayList,
  (merchants, searchQuery, autopayList) => {
    const cleanedSearchQuery = searchQuery && searchQuery.toLowerCase()
    const filterMerchants = merchant => {
      const { nickname, pubkey } = merchant
      return (
        (!searchQuery || nickname.toLowerCase().includes(cleanedSearchQuery)) &&
        !([pubkey] in autopayList)
      )
    }

    return merchants.filter(filterMerchants)
  }
)

/**
 * Returns array of active autopay entries combined with a corresponding merchant data
 */
autopaySelectors.autopayListAsArray = createSelector(
  autopaySelectors.merchants,
  autopaySelectors.autopayList,
  tickerSelectors.autopayCurrencyName,
  (merchants, autopayList, autopayCurrencyName) => {
    return merchants.reduce((acc, next) => {
      if (autopayList[next.pubkey]) {
        acc.push({
          ...next,
          isActive: true,
          limit: autopayList[next.pubkey].limit,
          limitCurrency: autopayCurrencyName,
        })
      }
      return acc
    }, [])
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
