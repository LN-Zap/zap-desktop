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
    { key: 'PENDING_ACTIVITY', name: 'Pending' },
    { key: 'FUNDED_ACTIVITY', name: 'Funding Transactions' }
  ],
  modal: {
    modalType: null,
    modalProps: {}
  },
  searchText: ''
}

// ------------------------------------
// Constants
// ------------------------------------
export const SHOW_ACTIVITY_MODAL = 'SHOW_ACTIVITY_MODAL'
export const HIDE_ACTIVITY_MODAL = 'HIDE_ACTIVITY_MODAL'

export const CHANGE_FILTER = 'CHANGE_FILTER'

export const TOGGLE_PULLDOWN = 'TOGGLE_PULLDOWN'

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

export function updateSearchText(searchText) {
  return {
    type: UPDATE_SEARCH_TEXT,
    searchText
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
const channelsSelector = state => state.channels.channels

const allActivity = createSelector(
  searchSelector,
  paymentsSelector,
  invoicesSelector,
  transactionsSelector,
  (searchText, payments, invoices, transactions) => {
    const searchedArr = [...payments, ...invoices, ...transactions].filter((tx) => {
      if ((tx.tx_hash && tx.tx_hash.includes(searchText)) ||
          (tx.payment_hash && tx.payment_hash.includes(searchText)) ||
          (tx.payment_request && tx.payment_request.includes(searchText))) {
        return true
      }

      return false
    })

    return searchedArr.sort((a, b) => {
      const aTimestamp = Object.prototype.hasOwnProperty.call(a, 'time_stamp') ? a.time_stamp : a.creation_date
      const bTimestamp = Object.prototype.hasOwnProperty.call(b, 'time_stamp') ? b.time_stamp : b.creation_date

      return bTimestamp - aTimestamp
    })
  }
)

const invoiceActivity = createSelector(
  invoicesSelector,
  invoices => invoices
)

const sentActivity = createSelector(
  transactionsSelector,
  paymentsSelector,
  (transactions, payments) => {
    const sentTransactions = transactions.filter(transaction => transaction.amount < 0)
    return [...sentTransactions, ...payments].sort((a, b) => {
      const aTimestamp = Object.prototype.hasOwnProperty.call(a, 'time_stamp') ? a.time_stamp : a.creation_date
      const bTimestamp = Object.prototype.hasOwnProperty.call(b, 'time_stamp') ? b.time_stamp : b.creation_date

      return bTimestamp - aTimestamp
    })
  }
)

const pendingActivity = createSelector(
  invoicesSelector,
  invoices => invoices.filter(invoice => !invoice.settled)
)

const fundedActivity = createSelector(
  transactionsSelector,
  channelsSelector,
  (transactions, channels) => {
    const fundingTxIds = channels.map(channel => channel.channel_point.split(':')[0])

    return transactions.filter(transaction => fundingTxIds.includes(transaction.tx_hash))
  }
)

const FILTERS = {
  ALL_ACTIVITY: allActivity,
  SENT_ACTIVITY: sentActivity,
  REQUESTED_ACTIVITY: invoiceActivity,
  PENDING_ACTIVITY: pendingActivity,
  FUNDED_ACTIVITY: fundedActivity
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
