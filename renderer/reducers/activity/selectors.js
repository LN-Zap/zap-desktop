/**
 * @typedef {import('../index').State} State
 * @typedef {import('../invoice').DecoratedInvoice} DecoratedInvoice
 * @typedef {import('../transaction').DecoratedTransaction} DecoratedTransaction
 */

import { createSelector } from 'reselect'

import { invoiceSelectors } from 'reducers/invoice'
import { paymentSelectors } from 'reducers/payment'
import { transactionSelectors } from 'reducers/transaction'

import { defaultFilter } from './constants'
import { addDate, prepareData } from './utils'

/**
 * paymentsSelector - Payments.
 *
 * @param {State} state Redux state
 * @returns {object[]} List of payments
 */
const paymentsSelector = state => paymentSelectors.payments(state)

/**
 * paymentsSendingSelector - Payments sending.
 *
 * @param {State} state Redux state
 * @returns {object[]} List of payments sending
 */
const paymentsSendingSelector = state => paymentSelectors.paymentsSending(state)

/**
 * invoicesSelector - Invoice.
 *
 * @param {State} state Redux state
 * @returns {DecoratedInvoice[]} List of invoices
 */
const invoicesSelector = state => invoiceSelectors.invoices(state)

/**
 * invoicesSelector - Transactions.
 *
 * @param {State} state Redux state
 * @returns {DecoratedTransaction[]} List of transactions
 */
const transactionsSelector = state => transactionSelectors.transactions(state)

/**
 * invoicesSelector - Transactions.
 *
 * @param {State} state Redux state
 * @returns {object[]} List of transactions sending
 */
const transactionsSendingSelector = state => transactionSelectors.transactionsSending(state)

/**
 * filter - Activity filter.
 *
 * @param {State} state Redux state
 * @returns {Set<string>} Current activity filter
 */
export const filter = state => state.activity.filter

/**
 * hasNextPage - Activity pagination more state.
 *
 * @param {State} state Redux state
 * @returns {boolean} Boolean indicating if there are more pages of activity data to paginate
 */
export const hasNextPage = state => state.activity.hasNextPage

/**
 * isPageLoading - Activity page loading state.
 *
 * @param {State} state Redux state
 * @returns {boolean} Boolean indicating if the activty pager is loading items.
 */
export const isPageLoading = state => state.activity.isPageLoading

/**
 * filters - List of activity filters.
 *
 * @param {State} state Redux state
 * @returns {object[]}  List of activity filters
 */
export const filters = state => state.activity.filters

/**
 * searchText - Activity search text.
 *
 * @param {State} state Redux state
 * @returns {string|null} Current activity search text
 */
export const searchText = state => state.activity.searchText

/**
 * modalItemType - Item type of currently active activity modal.
 *
 * @param {State} state Redux state
 * @returns {string|null} Item type of currently active activity modal
 */
export const modalItemType = state => state.activity.modal.itemType

/**
 * modalItemId - Id of currently active activity modal.
 *
 * @param {State} state Redux state
 * @returns {string|null} Id of currently active activity modal
 */
export const modalItemId = state => state.activity.modal.itemId

/**
 * errorDialogDetails - Activity error dialog details.
 *
 * @param {State} state Redux state
 * @returns {Error|null} Error dialog details
 */
export const errorDialogDetails = state => state.activity.errorDialogDetails

/**
 * isErrorDialogOpen - Activity error dialog open state.
 */
export const isErrorDialogOpen = createSelector(errorDialogDetails, Boolean)

/**
 * activityModalItem - Currently active activity modal item.
 */
export const activityModalItem = createSelector(
  paymentsSelector,
  invoicesSelector,
  transactionsSelector,
  modalItemType,
  modalItemId,
  (payments, invoices, transactions, itemType, itemId) => {
    switch (itemType) {
      case 'INVOICE':
        return invoices.find(invoice => invoice.paymentRequest === itemId)
      case 'TRANSACTION':
        return transactions.find(transaction => transaction.txHash === itemId)
      case 'PAYMENT':
        return payments.find(payment => payment.paymentHash === itemId)
      default:
        return null
    }
  }
)

/**
 * Map sending transactions to something that looks like normal transactions.
 */
export const transactionsSending = createSelector(transactionsSendingSelector, ts => {
  const transactions = ts.map(transaction => {
    return {
      type: 'transaction',
      timeStamp: transaction.timestamp,
      amount: transaction.amount,
      sending: true,
      status: transaction.status,
      error: transaction.error,
    }
  })
  return transactions
})

/**
 * sentActivityRaw - Sent activity: pre-search.
 */
export const sentActivityRaw = createSelector(
  paymentsSelector,
  transactionsSelector,
  (payments, transactions) => {
    return [
      ...payments,
      ...transactions.filter(
        transaction =>
          !transaction.isReceived &&
          !transaction.isFunding &&
          !transaction.isClosing &&
          !transaction.isPending
      ),
    ].map(addDate)
  }
)

/**
 * receivedActivityRaw - Received activity: pre-search.
 */
export const receivedActivityRaw = createSelector(
  invoicesSelector,
  transactionsSelector,
  (invoices, transactions) => {
    return [
      ...invoices.filter(invoice => invoice.isSettled),
      ...transactions.filter(
        transaction =>
          transaction.isReceived &&
          !transaction.isFunding &&
          !transaction.isClosing &&
          !transaction.isPending
      ),
    ].map(addDate)
  }
)

/**
 * pendingActivityRaw - Pending activity: pre-search.
 */
export const pendingActivityRaw = createSelector(
  paymentsSendingSelector,
  transactionsSending,
  transactionsSelector,
  invoicesSelector,
  (paymentsSending, ts, transactions, invoices) => {
    return [
      ...paymentsSending,
      ...ts,
      ...transactions.filter(transaction => transaction.isPending),
      ...invoices.filter(invoice => !invoice.isSettled && !invoice.isExpired),
    ].map(addDate)
  }
)

/**
 * expiredActivityRaw - Expired activity: pre-search.
 */
export const expiredActivityRaw = createSelector(invoicesSelector, invoices => {
  return invoices.filter(invoice => !invoice.isSettled && invoice.isExpired).map(addDate)
})

/**
 * internalActivityRaw - Internal activity: pre-search.
 */
export const internalActivityRaw = createSelector(transactionsSelector, transactions => {
  return transactions
    .filter(
      transaction => transaction.isFunding || (transaction.isClosing && !transaction.isPending)
    )
    .map(addDate)
})

/**
 * internalActivity - Internal activity: post-search.
 */
export const internalActivity = createSelector(internalActivityRaw, searchText, prepareData)

/**
 * currentActivity - Filtered activity list.
 */
export const currentActivity = createSelector(
  searchText,
  filter,
  sentActivityRaw,
  receivedActivityRaw,
  pendingActivityRaw,
  expiredActivityRaw,
  internalActivityRaw,
  (searchTextValue, currentFilter, sent, received, pending, expired, internal) => {
    const result = []
    const curFilter = currentFilter.size ? currentFilter : defaultFilter

    curFilter.has('SENT_ACTIVITY') && result.push(...sent)
    curFilter.has('RECEIVED_ACTIVITY') && result.push(...received)
    curFilter.has('PENDING_ACTIVITY') && result.push(...pending)
    curFilter.has('EXPIRED_ACTIVITY') && result.push(...expired)
    curFilter.has('INTERNAL_ACTIVITY') && result.push(...internal)

    return prepareData(result, searchTextValue)
  }
)

export const isCustomFilter = createSelector(filter, currentFilter => {
  if (currentFilter.size && currentFilter.size !== defaultFilter.size) {
    return true
  }
  const difference = new Set([...currentFilter].filter(x => !defaultFilter.has(x)))
  return difference.size > 0
})

/**
 * All selectors to export.
 */
export default {
  errorDialogDetails,
  filter,
  filters,
  searchText,
  hasNextPage,
  isPageLoading,
  isErrorDialogOpen,
  currentActivity,
  activityModalItem,
  isCustomFilter,
}
