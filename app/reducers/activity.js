import { createSelector } from 'reselect'

// ------------------------------------
// Initial State
// ------------------------------------
const initialState = {
  filter: 'ALL_ACTIVITY',
  modal: {
    modalType: null,
    modalProps: {}
  }
}

// ------------------------------------
// Constants
// ------------------------------------
export const SHOW_ACTIVITY_MODAL = 'SHOW_ACTIVITY_MODAL'
export const HIDE_ACTIVITY_MODAL = 'HIDE_ACTIVITY_MODAL'

export const CHANGE_FILTER = 'CHANGE_FILTER'

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
  type: CHANGE_FILTER,
  filter
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SHOW_ACTIVITY_MODAL]: (state, { modalType, modalProps }) => ({ ...state, modal: { modalType, modalProps } }),
  [HIDE_ACTIVITY_MODAL]: (state) => ({ ...state, modal: { modalType: null, modalProps: {} } }),
  [CHANGE_FILTER]: (state, { filter }) => ({ ...state, filter })
}

// ------------------------------------
// Selectors
// ------------------------------------
const activitySelectors = {}
const filterSelector = state => state.activity.filter
const paymentsSelector = state => state.payment.payments
const invoicesSelector = state => state.invoice.invoices
const transactionsSelector = state => state.transaction.transactions

const allActivity = createSelector(
  paymentsSelector,
  invoicesSelector,
  transactionsSelector,
  (payments, invoices, transactions) => {
    return [...payments, ...invoices, ...transactions].sort((a, b) => {
      let aTimestamp = a.hasOwnProperty('time_stamp') ? a.time_stamp : a.creation_date
      let bTimestamp = b.hasOwnProperty('time_stamp') ? b.time_stamp : b.creation_date

      return bTimestamp - aTimestamp
    })
  }
)

const lnActivity = createSelector(
  paymentsSelector,
  invoicesSelector,
  (payments, invoices) => {
    return [...payments, ...invoices].sort((a, b) => {
      let aTimestamp = a.hasOwnProperty('time_stamp') ? a.time_stamp : a.creation_date
      let bTimestamp = b.hasOwnProperty('time_stamp') ? b.time_stamp : b.creation_date

      return bTimestamp - aTimestamp
    })
  }
)

const paymentActivity = createSelector(
  paymentsSelector,
  payments => payments
)

const invoiceActivity = createSelector(
  invoicesSelector,
  invoices => invoices
)

const transactionActivity = createSelector(
  transactionsSelector,
  transactions => transactions
)

activitySelectors.currentActivity = createSelector(
  filterSelector,
  filter => FILTERS[filter]
)

const FILTERS = {
  ALL_ACTIVITY: allActivity,
  LN_ACTIVITY: lnActivity,
  PAYMENT_ACTIVITY: paymentActivity,
  INVOICE_ACTIVITY: invoiceActivity,
  TRANSACTION_ACTIVITY: transactionActivity
}

export { activitySelectors }


// ------------------------------------
// Reducer
// ------------------------------------
export default function activityReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
