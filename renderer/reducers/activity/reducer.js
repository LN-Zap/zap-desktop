import { send } from 'redux-electron-ipc'
import groupBy from 'lodash/groupBy'
import config from 'config'
import { grpc } from 'workers'
import createReducer from '@zap/utils/createReducer'
import { getIntl } from '@zap/i18n'
import combinePaginators from '@zap/utils/pagination'
import { openModal, closeModal } from 'reducers/modal'
import { fetchDescribeNetwork } from 'reducers/network'
import { receiveTransactions } from 'reducers/transaction'
import { receivePayments } from 'reducers/payment'
import { receiveInvoices } from 'reducers/invoice'
import { fetchBalance } from 'reducers/balance'
import { showError, showNotification } from 'reducers/notification'
import { fetchChannels } from 'reducers/channels'
import activitySelectors from './selectors'
import messages from './messages'
import * as constants from './constants'

const {
  SHOW_ACTIVITY_MODAL,
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

// activity paginator object. must be reset for each wallet login
let paginator = null

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
 * saveInvoice - Initiates saving of invoice pdf.
 *
 * @param {string} options invoice options
 * @param {string} options.defaultFilename invoice title
 * @param {string} options.title invoice title
 * @param {string} options.subtitle invoice subtitle
 * @param {Array<Array>} options.invoiceData invoice rows
 * @returns {Function} Thunk
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
 * @returns {Function} Thunk
 */
export const saveInvoiceFailure = () => dispatch => {
  dispatch(showError(getIntl().formatMessage(messages.activity_invoice_download_error)))
}

/**
 * saveInvoiceSuccess - Invoice save success event.
 *
 * @returns {Function} Thunk
 */
export const saveInvoiceSuccess = () => dispatch => {
  dispatch(showNotification(getIntl().formatMessage(messages.activity_invoice_download_success)))
}

/**
 * showActivityModal - Show the activity modal with a given activity item.
 *
 * @param {string} itemType Item type
 * @param {string} itemId Item id
 * @returns {Function} Thunk
 */
export const showActivityModal = (itemType, itemId) => dispatch => {
  dispatch({ type: SHOW_ACTIVITY_MODAL, itemType, itemId })
  dispatch(openModal('ACTIVITY_MODAL'))
}

/**
 * hideActivityModal - Hide the activity modal.
 *
 * @returns {Function} Thunk
 */
export const hideActivityModal = () => dispatch => {
  dispatch({ type: HIDE_ACTIVITY_MODAL })
  dispatch(closeModal('ACTIVITY_MODAL'))
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
 * @param {string} searchText Search string to apply
 * @returns {object} Action
 */
export function updateSearchText(searchText = null) {
  return {
    type: UPDATE_SEARCH_TEXT,
    searchText,
  }
}

/**
 * createActivityPaginator - Creates activity paginator object.
 *
 * @returns {Function} Paginator
 */
function createActivityPaginator() {
  const fetchInvoices = async (pageSize, offset) => {
    const { invoices, first_index_offset } = await grpc.services.Lightning.listInvoices({
      num_max_invoices: pageSize,
      index_offset: offset,
      reversed: true,
    })
    return { items: invoices, offset: first_index_offset }
  }

  const fetchPayments = async () => {
    const { payments } = await grpc.services.Lightning.listPayments()
    return { items: payments, offset: 0 }
  }

  const fetchTransactions = async () => {
    const { transactions } = await grpc.services.Lightning.getTransactions()
    return { items: transactions, offset: 0 }
  }
  const getTimestamp = item => item.time_stamp || item.settle_date || item.creation_date
  const itemSorter = (a, b) => getTimestamp(b) - getTimestamp(a)
  return combinePaginators(itemSorter, fetchInvoices, fetchPayments, fetchTransactions)
}

/**
 * getPaginator - Returns current activity paginator object. This acts as a singleton
 * and creates paginator if it's not initialized.
 *
 * @returns {Function} Paginator
 */
function getPaginator() {
  if (!paginator) {
    paginator = createActivityPaginator()
  }
  return paginator
}

/**
 * loadNextPage - Loads next activity page if it's available.
 *
 * @returns {Function} Thunk
 */
export const loadNextPage = () => async (dispatch, getState) => {
  const thisPaginator = getPaginator()
  if (activitySelectors.hasNextPage(getState())) {
    const { items, hasNextPage } = await thisPaginator(config.activity.pageSize)

    const getItemType = item => {
      if (item.dest_addresses) {
        return 'transactions'
      }
      if ('add_index' in item) {
        return 'invoices'
      }
      return 'payments'
    }

    const { invoices, payments, transactions } = groupBy(items, getItemType)
    dispatch({ type: SET_HAS_NEXT_PAGE, value: hasNextPage })
    invoices && dispatch(receiveInvoices(invoices))
    payments && dispatch(receivePayments(payments))
    transactions && dispatch(receiveTransactions(transactions))
  }
}

/**
 * fetchActivityHistory - Fetch user activity history, including Balance, Payments, Invoices, Transactions etc.
 *
 * @returns {Function} Thunk
 */
export const fetchActivityHistory = () => dispatch => {
  dispatch({ type: FETCH_ACTIVITY_HISTORY })
  try {
    dispatch(fetchDescribeNetwork())
    dispatch(fetchChannels())
    dispatch(fetchBalance())
    dispatch(loadNextPage())
    dispatch({ type: FETCH_ACTIVITY_HISTORY_SUCCESS })
  } catch (error) {
    dispatch({ type: FETCH_ACTIVITY_HISTORY_FAILURE, error })
  }
}

export const resetActivity = () => () => {
  paginator = null
}

// ------------------------------------
// Action Handlers
// ------------------------------------

const ACTION_HANDLERS = {
  [SHOW_ACTIVITY_MODAL]: (state, { itemType, itemId }) => {
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
