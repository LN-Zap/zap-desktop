import { createSelector } from 'reselect'
import { transactionsSelectors } from 'reducers/transaction'
import { paymentSelectors } from 'reducers/payment'
import { invoiceSelectors } from 'reducers/invoice'
import { addDate, prepareData } from './utils'
import { defaultFilter } from './constants'

const paymentsSelector = state => paymentSelectors.payments(state)
const paymentsSendingSelector = state => paymentSelectors.paymentsSending(state)
const invoicesSelector = state => invoiceSelectors.invoices(state)
const transactionsSelector = state => transactionsSelectors.transactions(state)
const transactionsSendingSelector = state => transactionsSelectors.transactionsSending(state)

/**
 * filter - Activity filter.
 *
 * @param  {object} state redux state
 * @returns {string} Current activity filter
 */
export const filter = state => state.activity.filter

/**
 * hasNextPage - Activity pagination more state.
 *
 * @param  {object} state redux state
 * @returns {boolean} Boolean indicating if there are more pages of activity data to paginate
 */
export const hasNextPage = state => state.activity.hasNextPage

/**
 * filters - List of activity filters.
 *
 * @param  {object} state redux state
 * @returns {Array}  List of activity filters
 */
export const filters = state => state.activity.filters

/**
 * searchText - Activity search text.
 *
 * @param  {object} state redux state
 * @returns {string} Current activity search text
 */
export const searchText = state => state.activity.searchText

/**
 * modalItemType - Item type of currently active activity modal.
 *
 * @param  {object} state redux state
 * @returns {string} Item type of currently active activity modal
 */
export const modalItemType = state => state.activity.modal.itemType

/**
 * modalItemId - Id of currently active activity modal.
 *
 * @param  {object} state redux state
 * @returns {string} Id of currently active activity modal
 */
export const modalItemId = state => state.activity.modal.itemId

/**
 * errorDialogDetails - Activity error dialog details.
 *
 * @param  {object} state redux state
 * @returns {object} Error dialog details
 */
export const errorDialogDetails = state => state.activity.errorDialogDetails

/**
 * isErrorDialogOpen - Activity error dialog open state.
 */
export const isErrorDialogOpen = createSelector(
  errorDialogDetails,
  Boolean
)

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

/**
 * Map sending transactions to something that looks like normal transactions.
 */
export const transactionsSending = createSelector(
  transactionsSendingSelector,
  ts => {
    const transactions = ts.map(transaction => {
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
          !transaction.received &&
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
      ...invoices.filter(invoice => invoice.settled),
      ...transactions.filter(
        transaction =>
          transaction.received &&
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
      ...invoices.filter(invoice => !invoice.settled && !invoice.isExpired),
    ].map(addDate)
  }
)

/**
 * expiredActivityRaw - Expired activity: pre-search.
 */
export const expiredActivityRaw = createSelector(
  invoicesSelector,
  invoices => {
    return invoices.filter(invoice => !invoice.settled && invoice.isExpired).map(addDate)
  }
)

/**
 * internalActivityRaw - Internal activity: pre-search.
 */
export const internalActivityRaw = createSelector(
  transactionsSelector,
  transactions => {
    return transactions
      .filter(
        transaction => transaction.isFunding || (transaction.isClosing && !transaction.isPending)
      )
      .map(addDate)
  }
)

/**
 * internalActivity - Internal activity: post-search.
 */
export const internalActivity = createSelector(
  internalActivityRaw,
  searchText,
  prepareData
)

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
  (searchTextValue, filters, sent, received, pending, expired, internal) => {
    const result = []
    const curFilter = filters.size ? filters : defaultFilter

    curFilter.has('SENT_ACTIVITY') && result.push(...sent)
    curFilter.has('RECEIVED_ACTIVITY') && result.push(...received)
    curFilter.has('PENDING_ACTIVITY') && result.push(...pending)
    curFilter.has('EXPIRED_ACTIVITY') && result.push(...expired)
    curFilter.has('INTERNAL_ACTIVITY') && result.push(...internal)

    return prepareData(result, searchTextValue)
  }
)

export const isCustomFilter = createSelector(
  filter,
  filters => {
    if (filters.size && filters.size !== defaultFilter.size) {
      return true
    }
    const difference = new Set([...filters].filter(x => !defaultFilter.has(x)))
    return difference.size > 0
  }
)

/**
 * All selectors to export.
 */
export default {
  filter,
  filters,
  searchText,
  hasNextPage,
  isErrorDialogOpen,
  errorDialogDetails,
  currentActivity,
  activityModalItem,
  isCustomFilter,
}
