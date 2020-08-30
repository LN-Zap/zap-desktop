import { send } from 'redux-electron-ipc'
import groupBy from 'lodash/groupBy'
import range from 'lodash/range'
import createReducer from '@zap/utils/createReducer'
import { getIntl } from '@zap/i18n'
import { mainLog } from '@zap/utils/log'
import { openModal, closeModal } from 'reducers/modal'
import { receiveTransactions } from 'reducers/transaction'
import { receivePayments } from 'reducers/payment'
import { receiveInvoices } from 'reducers/invoice'
import { settingsSelectors } from 'reducers/settings'
import { fetchBalance } from 'reducers/balance'
import { fetchChannels } from 'reducers/channels'
import { showError, showNotification } from 'reducers/notification'
import { createActivityPaginator, getItemType } from './utils'
import { hasNextPage } from './selectors'
import messages from './messages'
import * as constants from './constants'

const {
  SET_ACTIVITY_MODAL,
  HIDE_ACTIVITY_MODAL,
  CHANGE_FILTER,
  UPDATE_SEARCH_TEXT,
  FETCH_ACTIVITY_HISTORY,
  FETCH_ACTIVITY_HISTORY_SUCCESS,
  FETCH_ACTIVITY_HISTORY_FAILURE,
  ADD_FILTER,
  SET_HAS_NEXT_PAGE,
  SET_ERROR_DIALOG_DETAILS,
} = constants

// ------------------------------------
// Initial State
// ------------------------------------

/**
 * @typedef State
 * @property {Set<string>} filter Currently applied activity filter.
 * @property {object[]} filters List of supported activity filters.
 * @property {{itemType: string|null, itemId: string|null}} modal Activity item currently showing in activity modal.
 * @property {Error|null} errorDialogDetails Activity error currently showing in error details dialog.
 * @property {string|null} searchText Current activity search string.
 * @property {boolean} isActivityLoading Boolean indicating if activity is loading.
 * @property {Error|null} activityLoadingError Error from loading activity.
 * @property {boolean} hasNextPage Boolean indicating if there are more activity pages to fetch.
 */

/** @type {State} */
const initialState = {
  filter: new Set([...constants.defaultFilter]),
  filters: [
    { key: 'SENT_ACTIVITY' },
    { key: 'RECEIVED_ACTIVITY' },
    { key: 'PENDING_ACTIVITY' },
    { key: 'EXPIRED_ACTIVITY' },
    { key: 'INTERNAL_ACTIVITY' },
  ],
  modal: {
    itemType: null,
    itemId: null,
  },
  errorDialogDetails: null,
  searchText: null,
  isActivityLoading: false,
  activityLoadingError: null,
  hasNextPage: true,
}

// ------------------------------------
// Helpers
// ------------------------------------

// activity paginator object. must be reset for each wallet login
/** @type {Function | null} */
let paginator = null
let loadedPages = 0

/**
 * getPaginator - Returns current activity paginator object. This acts as a singleton
 * and creates paginator if it's not initialized.
 *
 * @returns {Function} Paginator
 */
export const getPaginator = () => {
  if (!paginator) {
    paginator = createActivityPaginator()
  }
  return paginator
}

// ------------------------------------
// Actions
// ------------------------------------

/**
 * setErorDialogDetails - Set the error dialog details.
 *
 * @param {string} details Error details
 * @returns {object} Action
 */
export const setErorDialogDetails = details => {
  return {
    type: SET_ERROR_DIALOG_DETAILS,
    details,
  }
}

/**
 * changeFilter - Toggle specified activity filter.
 *
 * @param {...string} filterList Filter to apply
 * @returns {object} Action
 */
export function changeFilter(...filterList) {
  return {
    type: CHANGE_FILTER,
    filterList,
  }
}
/**
 * addFilter - Enable specified activity filters.
 *
 * @param {...string} filterList Filters to apply
 * @returns {object} Action
 */
export function addFilter(...filterList) {
  return {
    type: ADD_FILTER,
    filterList,
  }
}

/**
 * updateSearchText - Set the current activity search string.
 *
 * @param {string|null} searchText Search string to apply
 * @returns {object} Action
 */
export function updateSearchText(searchText = null) {
  return {
    type: UPDATE_SEARCH_TEXT,
    searchText,
  }
}

/**
 * saveInvoice - Initiates saving of invoice pdf.
 *
 * @param {object} options invoice options
 * @param {string} options.defaultFilename invoice title
 * @param {string} options.title invoice title
 * @param {string} options.subtitle invoice subtitle
 * @param {Array<object>} options.invoiceData invoice rows
 * @returns {(dispatch:Function) => Promise<void>} Thunk
 */
export const saveInvoice = ({
  defaultFilename,
  title,
  subtitle,
  invoiceData,
}) => async dispatch => {
  dispatch(send('saveInvoice', { defaultFilename, title, subtitle, invoiceData }))
}

/**
 * saveInvoiceFailure - Invoice save failed event.
 *
 * @returns {(dispatch:Function) => void} Thunk
 */
export const saveInvoiceFailure = () => dispatch => {
  dispatch(showError(getIntl().formatMessage(messages.activity_invoice_download_error)))
}

/**
 * saveInvoiceSuccess - Invoice save success event.
 *
 * @returns {(dispatch:Function) => void} Thunk
 */
export const saveInvoiceSuccess = () => dispatch => {
  dispatch(showNotification(getIntl().formatMessage(messages.activity_invoice_download_success)))
}

/**
 * setActivityModal - Show the activity modal with a given activity item.
 *
 * @param {string} itemType Item type
 * @param {string} itemId Item id
 * @returns {(dispatch:Function) => void} Thunk
 */
export const setActivityModal = (itemType, itemId) => dispatch => {
  dispatch({ type: SET_ACTIVITY_MODAL, itemType, itemId })
}

/**
 * showActivityModal - Show the activity modal with a given activity item.
 *
 * @param {string} itemType Item type
 * @param {string} itemId Item id
 * @returns {(dispatch:Function) => void} Thunk
 */
export const showActivityModal = (itemType, itemId) => dispatch => {
  dispatch(setActivityModal(itemType, itemId))
  dispatch(openModal('ACTIVITY_MODAL'))
}

/**
 * hideActivityModal - Hide the activity modal.
 *
 * @returns {(dispatch:Function) => void} Thunk
 */
export const hideActivityModal = () => dispatch => {
  dispatch({ type: HIDE_ACTIVITY_MODAL })
  dispatch(closeModal('ACTIVITY_MODAL'))
}

/**
 * resetActivity - Reset activity history.
 *
 * @returns {() => void} Thunk
 */
export const resetActivity = () => () => {
  paginator = null
  loadedPages = 0
}

/**
 * resetPaginator - Reset activity paginator.
 *
 * @returns {() => void} Thunk
 */
export const resetPaginator = () => () => {
  paginator = null
}

/**
 * loadPage - Loads next activity page if it's available.
 *
 * @param {boolean} reload Boolean indicating if this page load is part of a reload.
 * @returns {(dispatch:Function, getState:Function) => Promise<void>} Thunk
 */
export const loadPage = (reload = false) => async (dispatch, getState) => {
  const config = settingsSelectors.currentConfig(getState())
  const thisPaginator = getPaginator()
  if (reload || hasNextPage(getState())) {
    const { pageSize } = config.activity
    const { items, hasNextPage: paginatorHasNextPage } = await thisPaginator(pageSize)

    if (!reload) {
      loadedPages += 1
      dispatch({ type: SET_HAS_NEXT_PAGE, value: paginatorHasNextPage })
    }

    const { invoices, payments, transactions } = groupBy(items, getItemType)
    invoices && dispatch(receiveInvoices(invoices))
    payments && dispatch(receivePayments(payments))
    transactions && dispatch(receiveTransactions(transactions))
  }
}

/**
 * reloadPages - Reloads all already loaded activity pages.
 *
 * @returns {(dispatch:Function) => Promise<void>} Thunk
 */
export const reloadPages = () => async dispatch => {
  const pageCount = loadedPages
  mainLog.debug(`reloading ${pageCount} activity pages`)
  dispatch(resetPaginator())

  // eslint-disable-next-line no-unused-vars
  for (const page of range(pageCount)) {
    mainLog.debug(`reloading activity page ${page}`)
    // eslint-disable-next-line no-await-in-loop
    await dispatch(loadPage(true))
  }
}

/**
 * initActivityHistory - Load user activity history.
 *
 * @returns {(dispatch:Function) => void} Thunk
 */
export const initActivityHistory = () => async dispatch => {
  dispatch({ type: FETCH_ACTIVITY_HISTORY })
  try {
    await dispatch(loadPage())
    dispatch(fetchChannels())
    dispatch(fetchBalance())
    dispatch({ type: FETCH_ACTIVITY_HISTORY_SUCCESS })
  } catch (error) {
    dispatch({ type: FETCH_ACTIVITY_HISTORY_FAILURE, error })
  }
}

/**
 * reloadActivityHistory - Reload activity history.
 *
 * @returns {(dispatch:Function) => void} Thunk
 */
export const reloadActivityHistory = () => async dispatch => {
  dispatch({ type: FETCH_ACTIVITY_HISTORY })
  try {
    await dispatch(reloadPages())
    dispatch(fetchChannels())
    dispatch(fetchBalance())
    dispatch({ type: FETCH_ACTIVITY_HISTORY_SUCCESS })
  } catch (error) {
    dispatch({ type: FETCH_ACTIVITY_HISTORY_FAILURE, error })
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------

const ACTION_HANDLERS = {
  [SET_ACTIVITY_MODAL]: (state, { itemType, itemId }) => {
    state.modal = { itemType, itemId }
  },
  [HIDE_ACTIVITY_MODAL]: state => {
    state.modal = { itemType: null, itemId: null }
  },
  [CHANGE_FILTER]: (state, { filterList }) => {
    const { filter } = state
    filterList.forEach(item => {
      if (filter.has(item)) {
        filter.delete(item)
      } else {
        filter.add(item)
      }
    })
  },
  [ADD_FILTER]: (state, { filterList }) => {
    const { filter } = state
    // No filters means all filters are active so no need to add anything
    if (filter.size > 0) {
      filterList.forEach(item => filter.add(item))
    }
  },
  [UPDATE_SEARCH_TEXT]: (state, { searchText }) => {
    state.searchText = searchText
  },
  [FETCH_ACTIVITY_HISTORY]: state => {
    state.isActivityLoading = true
  },
  [FETCH_ACTIVITY_HISTORY_SUCCESS]: state => {
    state.isActivityLoading = false
  },
  [FETCH_ACTIVITY_HISTORY_FAILURE]: (state, { error }) => {
    state.isActivityLoading = false
    state.activityLoadingError = error
  },
  [SET_HAS_NEXT_PAGE]: (state, { value }) => {
    state.hasNextPage = value
  },
  [SET_ERROR_DIALOG_DETAILS]: (state, { details }) => {
    state.errorDialogDetails = details
  },
}

export default createReducer(initialState, ACTION_HANDLERS)
