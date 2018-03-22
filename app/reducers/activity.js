import { createSelector } from 'reselect'

// ------------------------------------
// Initial State
// ------------------------------------
const initialState = {
  filterPulldown: false,
  filter: { key: 'ALL_ACTIVITY', name: 'All Activity' },
  filters: [
    { key: 'ALL_ACTIVITY', name: 'All' },
    { key: 'SENT_ACTIVITY', name: 'Sent' },
    { key: 'REQUESTED_ACTIVITY', name: 'Requested' },
    { key: 'PENDING_ACTIVITY', name: 'Pending' }
  ],
  modal: {
    modalType: null,
    modalProps: {},
    showCurrencyFilters: false
  },
  searchActive: false,
  searchText: ''
}

// ------------------------------------
// Constants
// ------------------------------------
export const SHOW_ACTIVITY_MODAL = 'SHOW_ACTIVITY_MODAL'
export const HIDE_ACTIVITY_MODAL = 'HIDE_ACTIVITY_MODAL'

export const CHANGE_FILTER = 'CHANGE_FILTER'

export const TOGGLE_PULLDOWN = 'TOGGLE_PULLDOWN'

export const SET_ACTIVITY_MODAL_CURRENCY_FILTERS = 'SET_ACTIVITY_MODAL_CURRENCY_FILTERS'

export const UPDATE_SEARCH_ACTIVE = 'UPDATE_SEARCH_ACTIVE'
export const UPDATE_SEARCH_TEXT = 'UPDATE_SEARCH_TEXT'

// ------------------------------------
// Actions
// ------------------------------------
export function showActivityModal(modalType, modalProps) {
  return {
    type: SHOW_ACTIVITY_MODAL,
    modalType,
    modalProps
  }
}

export function hideActivityModal() {
  return {
    type: HIDE_ACTIVITY_MODAL
  }
}

export function changeFilter(filter) {
  return {
    type: CHANGE_FILTER,
    filter
  }
}

export function toggleFilterPulldown() {
  return {
    type: TOGGLE_PULLDOWN
  }
}

export function updateSearchActive(searchActive) {
  return {
    type: UPDATE_SEARCH_ACTIVE,
    searchActive
  }
}

export function updateSearchText(searchText) {
  return {
    type: UPDATE_SEARCH_TEXT,
    searchText
  }
}

export function setActivityModalCurrencyFilters(showCurrencyFilters) {
  return {
    type: SET_ACTIVITY_MODAL_CURRENCY_FILTERS,
    showCurrencyFilters
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SHOW_ACTIVITY_MODAL]: (state, { modalType, modalProps }) => ({ ...state, modal: { modalType, modalProps } }),
  [HIDE_ACTIVITY_MODAL]: state => ({ ...state, modal: { modalType: null, modalProps: {} } }),
  [CHANGE_FILTER]: (state, { filter }) => ({ ...state, filter, filterPulldown: false }),
  [TOGGLE_PULLDOWN]: state => ({ ...state, filterPulldown: !state.filterPulldown }),

  [SET_ACTIVITY_MODAL_CURRENCY_FILTERS]: (state, { showCurrencyFilters }) => (
    { ...state, modal: { modalType: state.modal.modalType, modalProps: state.modal.modalProps, showCurrencyFilters } }
  ),

  [UPDATE_SEARCH_ACTIVE]: (state, { searchActive }) => ({ ...state, searchActive }),
  [UPDATE_SEARCH_TEXT]: (state, { searchText }) => ({ ...state, searchText })
}

// ------------------------------------
// Selectors
// ------------------------------------
const activitySelectors = {}
const filtersSelector = state => state.activity.filters
const filterSelector = state => state.activity.filter
const searchSelector = state => state.activity.searchText
const paymentsSelector = state => state.payment.payments
const invoicesSelector = state => state.invoice.invoices
const transactionsSelector = state => state.transaction.transactions

const invoiceExpired = (invoice) => {
  const expiresAt = (parseInt(invoice.creation_date, 10) + parseInt(invoice.expiry, 10))
  return expiresAt < (Date.now() / 1000)
}

// helper function that returns invoice, payment or transaction timestamp
function returnTimestamp(transaction) {
  // if on-chain txn
  if (Object.prototype.hasOwnProperty.call(transaction, 'time_stamp')) { return transaction.time_stamp }
  // if invoice that has been paid
  if (transaction.settled) { return transaction.settle_date }
  // if invoice that has not been paid or an LN payment
  return transaction.creation_date
}

// getMonth() returns the month in 0 index (0 for Jan), so we create an arr of the
// string representation we want for the UI
const months = ['Jan', 'Feb', 'Mar', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// groups the data by day
function groupData(data) {
  return data.reduce((arr, el) => {
    const d = new Date(returnTimestamp(el) * 1000)
    const date = d.getDate()
    const title = `${months[d.getMonth()]} ${date}, ${d.getFullYear()}`

    if (!arr[title]) { arr[title] = [] }

    arr[title].push({ el })

    return arr
  }, {})
}

// takes the result of groupData and returns an array
function groupArray(data) {
  return Object.keys(data).map(title => ({ title, activity: data[title] }))
}

// sorts data form new to old according to the timestamp
function sortNewToOld(data) {
  return data.sort((a, b) => new Date(b.title).getTime() - new Date(a.title).getTime())
}

// take in a dataset and return an array grouped by day
function groupAll(data) {
  const groups = groupData(data)
  const groupArrays = groupArray(groups)
  return sortNewToOld(groupArrays)
}

const allActivity = createSelector(
  searchSelector,
  paymentsSelector,
  invoicesSelector,
  transactionsSelector,
  (searchText, payments, invoices, transactions) => {
    let result = [...payments, ...invoices, ...transactions]
    if (searchText) {
      // exclude transaction not matching search
      result = result.filter(tx => (
        (tx.tx_hash && tx.tx_hash.includes(searchText)) ||
        (tx.payment_hash && tx.payment_hash.includes(searchText)) ||
        (tx.payment_request && tx.payment_request.includes(searchText))
      ))
    }

    result = result.filter(tx => (
      // exclude expired transaction
      !Object.prototype.hasOwnProperty.call(tx, 'expiry') || !invoiceExpired(tx)
    ))

    if (!result.length) { return [] }

    return groupAll(result)
  }
)

const invoiceActivity = createSelector(
  invoicesSelector,
  invoices => groupAll(invoices)
)

const sentActivity = createSelector(
  transactionsSelector,
  paymentsSelector,
  (transactions, payments) => groupAll([...transactions.filter(transaction => transaction.amount < 0), ...payments])
)

const pendingActivity = createSelector(
  invoicesSelector,
  invoices => groupAll(invoices.filter(invoice => !invoice.settled && !invoiceExpired(invoice)))
)

const FILTERS = {
  ALL_ACTIVITY: allActivity,
  SENT_ACTIVITY: sentActivity,
  REQUESTED_ACTIVITY: invoiceActivity,
  PENDING_ACTIVITY: pendingActivity
}

activitySelectors.currentActivity = createSelector(
  filterSelector,
  filter => FILTERS[filter.key]
)

activitySelectors.nonActiveFilters = createSelector(
  filtersSelector,
  filterSelector,
  (filters, filter) => filters.filter(f => f.key !== filter.key)
)

export { activitySelectors }


// ------------------------------------
// Reducer
// ------------------------------------
export default function activityReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
