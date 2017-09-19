import { createSelector } from 'reselect'

const activitySelectors = {}
const paymentsSelector = state => state.payment.payments
const invoicesSelector = state => state.invoice.invoices
const transactionsSelector = state => state.transaction.transactions

activitySelectors.sortedActivity = createSelector(
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

export default activitySelectors