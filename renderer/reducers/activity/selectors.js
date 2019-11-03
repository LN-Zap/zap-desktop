import { createSelector } from 'reselect'
import { transactionsSelectors } from 'reducers/transaction'
import { paymentSelectors } from 'reducers/payment'
import { invoiceSelectors } from 'reducers/invoice'
import { addDate, invoiceExpired, prepareData } from './utils'

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
 * allActivityRaw - All activity: pre-search.
 */
export const allActivityRaw = createSelector(
  paymentsSendingSelector,
  transactionsSending,
  paymentsSelector,
  transactionsSelector,
  invoicesSelector,
  (paymentsSending, ts, payments, transactions, invoices) => {
    return [
      ...paymentsSending,
      ...ts,
      ...payments,
      ...transactions.filter(
        transaction => !transaction.isFunding && !transaction.isClosing && !transaction.isPending
      ),
      ...invoices.filter(invoice => invoice.settled || !invoiceExpired(invoice)),
    ].map(addDate)
  }
)

/**
 * allActivity - All activity: post search.
 */
export const allActivity = createSelector(
  allActivityRaw,
  searchText,
  prepareData
)

/**
 * sentActivityRaw - Sent activity: pre-search.
 */
export const sentActivityRaw = createSelector(
  paymentsSendingSelector,
  transactionsSending,
  paymentsSelector,
  transactionsSelector,
  (paymentsSending, ts, payments, transactions) => {
    return [
      ...paymentsSending,
      ...ts,
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
 * sentActivity - Sent activity: post-search.
 */
export const sentActivity = createSelector(
  sentActivityRaw,
  searchText,
  prepareData
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
 * receivedActivity - Received activity: post-search.
 */
export const receivedActivity = createSelector(
  receivedActivityRaw,
  searchText,
  prepareData
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
      ...invoices.filter(invoice => !invoice.settled && !invoiceExpired(invoice)),
    ].map(addDate)
  }
)

/**
 * pendingActivity - Pending activity: post-search.
 */
export const pendingActivity = createSelector(
  pendingActivityRaw,
  searchText,
  prepareData
)

/**
 * expiredActivityRaw - Expired activity: pre-search.
 */
export const expiredActivityRaw = createSelector(
  invoicesSelector,
  invoices => {
    return invoices.filter(invoice => !invoice.settled && invoiceExpired(invoice)).map(addDate)
  }
)

/**
 * expiredActivity - Expired activity: post-search.
 */
export const expiredActivity = createSelector(
  expiredActivityRaw,
  searchText,
  prepareData
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
  filter,
  f => {
    const FILTERS = {
      ALL_ACTIVITY: allActivity,
      SENT_ACTIVITY: sentActivity,
      RECEIVED_ACTIVITY: receivedActivity,
      PENDING_ACTIVITY: pendingActivity,
      EXPIRED_ACTIVITY: expiredActivity,
      INTERNAL_ACTIVITY: internalActivity,
    }
    return FILTERS[f]
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
}
