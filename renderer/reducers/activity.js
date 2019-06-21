import { createSelector } from 'reselect'
import { openModal, closeModal } from './modal'
import { fetchDescribeNetwork } from './network'
import { fetchTransactions, transactionsSelectors } from './transaction'
import { fetchPayments, paymentSelectors } from './payment'
import { fetchInvoices, invoiceSelectors } from './invoice'
import { fetchBalance } from './balance'
import { fetchChannels } from './channels'

// ------------------------------------
// Initial State
// ------------------------------------
const initialState = {
  filter: 'ALL_ACTIVITY',
  filters: [
    { key: 'ALL_ACTIVITY' },
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
  searchText: null,
  isActivityLoading: false,
  activityLoadingError: null,
}

// ------------------------------------
// Constants
// ------------------------------------

export const SHOW_ACTIVITY_MODAL = 'SHOW_ACTIVITY_MODAL'
export const HIDE_ACTIVITY_MODAL = 'HIDE_ACTIVITY_MODAL'
export const CHANGE_FILTER = 'CHANGE_FILTER'
export const UPDATE_SEARCH_TEXT = 'UPDATE_SEARCH_TEXT'
export const FETCH_ACTIVITY_HISTORY = 'FETCH_ACTIVITY_HISTORY'
export const FETCH_ACTIVITY_HISTORY_SUCCESS = 'FETCH_ACTIVITY_HISTORY_SUCCESS'
export const FETCH_ACTIVITY_HISTORY_FAILURE = 'FETCH_ACTIVITY_HISTORY_FAILURE'

// ------------------------------------
// Helpers
// ------------------------------------

// getMonth() returns the month in 0 index (0 for Jan), so we create an arr of the
// string representation we want for the UI
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/**
 * propMatches - Check wether a prop exists and contains a given search string.
 *
 * @param  {string}  prop Prop name
 * @returns {boolean} Boolean indicating if the prop was found and contains the search string
 */
const propMatches = function(prop) {
  const { item, searchTextSelector = '' } = this
  return item[prop] && item[prop].toLowerCase().includes(searchTextSelector.toLowerCase())
}

/**
 * invoiceExpired - Check wether an invoice is expired.
 *
 * @param  {object}  invoice Invoice
 * @returns {boolean} Boolean indicating if the invoice has expired
 */
const invoiceExpired = invoice => {
  const expiresAt = parseInt(invoice.creation_date, 10) + parseInt(invoice.expiry, 10)
  return expiresAt < Math.round(new Date() / 1000)
}

/**
 * returnTimestamp - Returns invoice, payment or transaction timestamp.
 *
 * @param  {object} activity Activity item
 * @returns {string} Timestamp
 */
function returnTimestamp(activity) {
  switch (activity.type) {
    case 'transaction':
      return activity.time_stamp
    case 'invoice':
      return activity.settled ? activity.settle_date : activity.creation_date
    case 'payment':
      return activity.creation_date
  }
}

/**
 * groupAll - Sorts data by date and inserts grouping titles.
 *
 * @param {Array} data Items to group
 * @returns {Array} Groups items
 */
function groupAll(data) {
  // according too https://stackoverflow.com/a/11252167/3509860
  // this provides an accurate measurement including handling of DST
  const daysBetween = (t1, t2) => Math.round((t2 - t1) / 86400)
  return data
    .sort((a, b) => b.timestamp - a.timestamp)
    .reduce((acc, next) => {
      const prev = acc[acc.length - 1]
      //check if need insert a group title
      if (prev) {
        const days = daysBetween(next.timestamp, prev.timestamp)
        if (days >= 1) {
          acc.push({ title: next.date })
        }
      } else {
        //This is a very first row. Insert title here too
        acc.push({ title: next.date })
      }
      acc.push(next)
      return acc
    }, [])
}

/**
 * applySearch - Filter activity list by checking various properties against a given search string.
 *
 * @param  {Array}  data Activity item list
 * @param  {string} searchTextSelector Search text
 * @returns {Array}  Filtered activity list
 */
const applySearch = (data, searchTextSelector) => {
  if (!searchTextSelector) {
    return data
  }

  return data.filter(item => {
    // Check basic props for a match.
    const hasPropMatch = [
      'date',
      'type',
      'memo',
      'tx_hash',
      'payment_hash',
      'payment_preimage',
      'payment_request',
      'dest_node_pubkey',
      'dest_node_alias',
    ].some(propMatches, { item, searchTextSelector })

    // Check every destination address.
    const hasAddressMatch =
      item.dest_addresses && item.dest_addresses.find(addr => addr.includes(searchTextSelector))

    // Include the item if at least one search criteria matches.
    return hasPropMatch || hasAddressMatch
  })
}

const prepareData = (data, searchText) => {
  return groupAll(applySearch(data, searchText))
}

// ------------------------------------
// Actions
// ------------------------------------

/**
 * showActivityModal - Show the activity modal with a given activity item.
 *
 * @param {string} itemType Item type
 * @param {string} itemId Item id
 * @returns {undefined}
 */
export const showActivityModal = (itemType, itemId) => dispatch => {
  dispatch({ type: SHOW_ACTIVITY_MODAL, itemType, itemId })
  dispatch(openModal('ACTIVITY_MODAL'))
}

/**
 * hideActivityModal - Hide the activity modal.
 *
 * @returns {undefined}
 */
export const hideActivityModal = () => dispatch => {
  dispatch({ type: HIDE_ACTIVITY_MODAL })
  dispatch(closeModal('ACTIVITY_MODAL'))
}

/**
 * changeFilter - Set the current activity filter.
 *
 * @param {string} filter Filter to apply
 * @returns {undefined}
 */
export function changeFilter(filter) {
  return {
    type: CHANGE_FILTER,
    filter,
  }
}

/**
 * updateSearchText - Set the current activity search string.
 *
 * @param {string} searchText Search string to apply
 * @returns {undefined}
 */
export function updateSearchText(searchText = null) {
  return {
    type: UPDATE_SEARCH_TEXT,
    searchText,
  }
}

/**
 * fetchActivityHistory - Fetch user activity history, including Balance, Payments, Invoices, Transactions etc.
 *
 * @returns {undefined}
 */
export const fetchActivityHistory = () => dispatch => {
  dispatch({ type: FETCH_ACTIVITY_HISTORY })
  try {
    dispatch(fetchDescribeNetwork())
    dispatch(fetchChannels())
    dispatch(fetchBalance())
    dispatch(fetchPayments())
    dispatch(fetchInvoices())
    dispatch(fetchTransactions())
    dispatch({ type: FETCH_ACTIVITY_HISTORY_SUCCESS })
  } catch (error) {
    dispatch({ type: FETCH_ACTIVITY_HISTORY_FAILURE, error })
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------

const ACTION_HANDLERS = {
  [SHOW_ACTIVITY_MODAL]: (state, { itemType, itemId }) => ({
    ...state,
    modal: { itemType, itemId },
  }),
  [HIDE_ACTIVITY_MODAL]: state => ({ ...state, modal: { itemType: null, itemId: null } }),
  [CHANGE_FILTER]: (state, { filter }) => ({ ...state, filter }),
  [UPDATE_SEARCH_TEXT]: (state, { searchText }) => ({ ...state, searchText }),
  [FETCH_ACTIVITY_HISTORY]: state => ({ ...state, isActivityLoading: true }),
  [FETCH_ACTIVITY_HISTORY_SUCCESS]: state => ({ ...state, isActivityLoading: false }),
  [FETCH_ACTIVITY_HISTORY_FAILURE]: (state, { error }) => ({
    ...state,
    isActivityLoading: false,
    activityLoadingError: error,
  }),
}

// ------------------------------------
// Selectors
// ------------------------------------

const activitySelectors = {}
const filterSelector = state => state.activity.filter
const filtersSelector = state => state.activity.filters
const searchTextSelector = state => state.activity.searchText
const modalItemTypeSelector = state => state.activity.modal.itemType
const modalItemIdSelector = state => state.activity.modal.itemId
const paymentsSelector = state => paymentSelectors.payments(state)
const paymentsSendingSelector = state => paymentSelectors.paymentsSending(state)
const invoicesSelector = state => invoiceSelectors.invoices(state)
const transactionsSelector = state => transactionsSelectors.decoratedTransactionsSelector(state)
const transactionsSendingSelector = state => transactionsSelectors.transactionsSending(state)

activitySelectors.filter = filterSelector
activitySelectors.filters = filtersSelector
activitySelectors.searchText = searchTextSelector

/**
 * Map sending transactions to something that looks like normal transactions.
 */
const transactionsSending = createSelector(
  transactionsSendingSelector,
  transactionsSending => {
    const transactions = transactionsSending.map(transaction => {
      return {
        type: 'transaction',
        time_stamp: transaction.timestamp,
        amount: transaction.amount,
        sending: true,
        status: transaction.status,
        error: transaction.error,
      }
    })
    return transactions
  }
)

activitySelectors.activityModalItem = createSelector(
  paymentsSelector,
  invoicesSelector,
  transactionsSelector,
  modalItemTypeSelector,
  modalItemIdSelector,
  (payments, invoices, transactions, itemType, itemId) => {
    switch (itemType) {
      case 'INVOICE':
        return invoices.find(invoice => invoice.payment_request === itemId)
      case 'TRANSACTION':
        return transactions.find(transaction => transaction.tx_hash === itemId)
      case 'PAYMENT':
        return payments.find(payment => payment.payment_hash === itemId)
      default:
        return null
    }
  }
)

// decorates activity entry with date and timestamp fields
const addDate = entry => {
  const timestamp = returnTimestamp(entry)
  const d = new Date(timestamp * 1000)
  const date = d.getDate()
  return { ...entry, date: `${months[d.getMonth()]} ${date}, ${d.getFullYear()}`, timestamp }
}

// pre-search compound activity list
const allActivityRaw = createSelector(
  paymentsSendingSelector,
  transactionsSending,
  paymentsSelector,
  transactionsSelector,
  invoicesSelector,
  (paymentsSending, transactionsSending, payments, transactions, invoices) => {
    return [
      ...paymentsSending,
      ...transactionsSending,
      ...payments,
      ...transactions.filter(
        transaction => !transaction.isFunding && !transaction.isClosing && !transaction.isPending
      ),
      ...invoices.filter(invoice => invoice.settled || !invoiceExpired(invoice)),
    ].map(addDate)
  }
)

const allActivity = createSelector(
  searchTextSelector,
  allActivityRaw,
  (searchText, allData) => {
    return prepareData(allData, searchText)
  }
)

const sentActivity = createSelector(
  searchTextSelector,
  paymentsSendingSelector,
  transactionsSending,
  paymentsSelector,
  transactionsSelector,
  (searchText, paymentsSending, transactionsSending, payments, transactions) => {
    const allData = [
      ...paymentsSending,
      ...transactionsSending,
      ...payments,
      ...transactions.filter(
        transaction =>
          !transaction.received &&
          !transaction.isFunding &&
          !transaction.isClosing &&
          !transaction.isPending
      ),
    ]
    return prepareData(allData, searchText)
  }
)

const receivedActivity = createSelector(
  searchTextSelector,
  invoicesSelector,
  transactionsSelector,
  (searchText, invoices, transactions) => {
    const allData = [
      ...invoices.filter(invoice => invoice.settled),
      ...transactions.filter(
        transaction =>
          transaction.received &&
          !transaction.isFunding &&
          !transaction.isClosing &&
          !transaction.isPending
      ),
    ]
    return prepareData(allData, searchText)
  }
)

const pendingActivity = createSelector(
  searchTextSelector,
  paymentsSendingSelector,
  transactionsSending,
  transactionsSelector,
  invoicesSelector,
  (searchText, paymentsSending, transactionsSending, transactions, invoices) => {
    const allData = [
      ...paymentsSending,
      ...transactionsSending,
      ...transactions.filter(transaction => transaction.isPending),
      ...invoices.filter(invoice => !invoice.settled && !invoiceExpired(invoice)),
    ]
    return prepareData(allData, searchText)
  }
)

const expiredActivity = createSelector(
  searchTextSelector,
  invoicesSelector,
  (searchText, invoices) => {
    const allData = invoices.filter(invoice => !invoice.settled && invoiceExpired(invoice))
    return prepareData(allData, searchText)
  }
)

const internalActivity = createSelector(
  searchTextSelector,
  transactionsSelector,
  (searchText, transactions) => {
    const allData = transactions.filter(
      transaction => transaction.isFunding || (transaction.isClosing && !transaction.isPending)
    )
    return prepareData(allData, searchText)
  }
)

const FILTERS = {
  ALL_ACTIVITY: allActivity,
  SENT_ACTIVITY: sentActivity,
  RECEIVED_ACTIVITY: receivedActivity,
  PENDING_ACTIVITY: pendingActivity,
  EXPIRED_ACTIVITY: expiredActivity,
  INTERNAL_ACTIVITY: internalActivity,
}

activitySelectors.currentActivity = createSelector(
  filterSelector,
  filter => FILTERS[filter]
)

export { activitySelectors }

// ------------------------------------
// Reducer
// ------------------------------------

/**
 * activityReducer - Activity reducer.
 *
 * @param  {object} state = initialState Initial state
 * @param  {object} action Action
 * @returns {object} Final state
 */
export default function activityReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
