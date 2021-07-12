import { createSelector } from 'reselect'

import { getIntl } from '@zap/i18n'
import { getTag } from '@zap/utils/crypto'
import { isAutopayEnabled } from '@zap/utils/featureFlag'
import { showSystemNotification } from '@zap/utils/notifications'
import truncateNodePubkey from '@zap/utils/truncateNodePubkey'
import { tickerSelectors } from 'reducers/ticker'

import { contactFormSelectors } from './contactsform'
import messages from './messages'
import { getNodeDisplayName, networkSelectors } from './network'

// ------------------------------------
// Initial State
// ------------------------------------

const initialState = {
  isCreateModalOpen: false,
  searchQuery: null,
  merchants: [],
  list: {}, // current enabled autopay entries
}

// ------------------------------------
// Constants
// ------------------------------------

export const UPDATE_AUTOPAY_SEARCH_QUERY = 'UPDATE_AUTOPAY_SEARCH_QUERY'

export const SET_SELECTED_MERCHANT = 'SET_SELECTED_MERCHANT'
export const ENABLE_AUTOPAY = 'ENABLE_AUTOPAY'
export const DISABLE_AUTOPAY = 'DISABLE_AUTOPAY'
export const SET_AUTOPAY_LIST = 'SET_AUTOPAY_LIST'

export const SET_EDIT_MODE = 'SET_EDIT_MODE'
export const RESET_EDIT_MODE = 'RESET_EDIT_MODE'

// ------------------------------------
// Actions
// ------------------------------------

/**
 * enableAutopay - Enable autopay upto a certain amount for a given merchant.
 *
 * @param {string} merchantId Merchant Id
 * @param {string} limit Autopay limit
 * @returns {(dispatch:Function) => Promise<void>} Thunk
 */
export function enableAutopay(merchantId, limit) {
  return async dispatch => {
    await window.db.autopay.put({ id: merchantId, limit })
    return dispatch({
      type: ENABLE_AUTOPAY,
      data: { merchantId, limit },
    })
  }
}

/**
 * disableAutopay - Disable autopay for a given merchant.
 *
 * @param {string} merchantId Merchant Id
 * @returns {(dispatch:Function) => Promise<void>} Thunk
 */
export function disableAutopay(merchantId) {
  return async dispatch => {
    await window.db.autopay.delete(merchantId)
    return dispatch({
      type: DISABLE_AUTOPAY,
      merchantId,
    })
  }
}

/**
 * setAutopayList - Set list of enabled autopay merchants.
 *
 * @param {Array} list List of enabled autopay merchants
 * @returns {object} Action
 */
export function setAutopayList(list) {
  return {
    type: SET_AUTOPAY_LIST,
    list,
  }
}

/**
 * initAutopay - Initialize autopay module.
 *
 * @returns {(dispatch:Function) => Promise<void>} Thunk
 */
export function initAutopay() {
  return async dispatch => {
    if (!isAutopayEnabled()) {
      return
    }

    let autopayList
    try {
      autopayList = await window.db.autopay.toArray()
    } catch (e) {
      autopayList = []
    }
    dispatch(setAutopayList(autopayList))
  }
}

/**
 * setSelectedMerchant - Set the currently selected autopay merchant.
 *
 * @param {string} merchantId Merchant Id
 * @returns {object} Action
 */
export function setSelectedMerchant(merchantId) {
  return {
    type: SET_SELECTED_MERCHANT,
    selectedMerchantId: merchantId,
  }
}

/**
 * updateAutopaySearchQuery - Set the current autopay merchant search query.
 *
 * @param {string} searchQuery Search query
 * @returns {object} Action
 */
export function updateAutopaySearchQuery(searchQuery) {
  return {
    type: UPDATE_AUTOPAY_SEARCH_QUERY,
    searchQuery,
  }
}

/**
 * resetEditMode - Disable autopay edit mode.
 *
 * @returns {object} Action
 */
export function resetEditMode() {
  return {
    type: RESET_EDIT_MODE,
  }
}

/**
 * openAutopayCreateModal - Open the autopay create modal for a given merchant.
 *
 * @param {string} merchantId Merchant Id
 * @param {boolean} isEditMode Boolean indicating whether the modal is in edit mode
 * @returns {object} Action
 */
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

/**
 * closeAutopayCreateModal - Close the autopay create modal.
 *
 * @returns {object} Thunk
 */
export function closeAutopayCreateModal() {
  return dispatch => {
    dispatch(setSelectedMerchant())
    dispatch(resetEditMode())
  }
}

// ------------------------------------
// Helpers
// ------------------------------------

/**
 * addAutopayEntry - Add or replaces (if it already exists) an autopay entry.
 *
 * @param {object} state State data
 * @param {{data}} data Autopay configuration
 * @returns {object} Updated state data with additional autopay entry
 */
function addAutopayEntry(state, { data }) {
  const { list } = state
  const { merchantId, limit } = data
  return {
    ...state,
    list: { ...list, [merchantId]: { limit } },
  }
}

/**
 * removeAutopayEntry - Removes an autopay entry.
 *
 * @param {object} state State data
 * @param {{merchantId}} merchantId Merchant Id
 * @returns {object} Updated state data with autopay entry removed
 */
function removeAutopayEntry(state, { merchantId }) {
  const list = { ...state.list }
  delete list[merchantId]
  return { ...state, list }
}

/**
 * setAutopayListFromArray - Populate the autopay list from a list of autopay configurations.
 *
 * @param {object} state State data
 * @param {{list}} list List of autopay configurations
 * @returns {object} Updated state data with updated autopay list
 */
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

/**
 * showAutopayNotification - Show a system notification to advise users that autopay is taking place.
 *
 * @param {object} invoice Decoded bolt 11 Invoice
 * @returns {(dispatch:Function, getState:Function) => Promise<void>} Thunk
 */
export const showAutopayNotification = invoice => async (dispatch, getState) => {
  const nodes = networkSelectors.nodes(getState())

  const memo = getTag(invoice, 'description')
  const node = nodes.find(n => n.pubKey === invoice.payeeNodeKey)
  const nodeName = node ? getNodeDisplayName(node) : truncateNodePubkey(invoice.payeeNodeKey)

  const intl = getIntl()

  const title = intl.formatMessage(messages.autopay_notification_title, {
    amount: invoice.satoshis,
  })
  const message = intl.formatMessage(messages.autopay_notification_message, {
    amount: invoice.satoshis,
    pubkey: nodeName,
  })

  let body = message
  if (memo) {
    const detail = intl.formatMessage(messages.autopay_notification_detail, {
      reason: memo,
    })
    body += ` ${detail}`
  }

  showSystemNotification(title, { body })
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
// Selectors
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

/**
 * autopayReducer - Autopay reducer.
 *
 * @param {object} state = initialState Initial state
 * @param {object} action Action
 * @returns {object} Next state
 */
export default function autopayReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
