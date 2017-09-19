import { connect } from 'react-redux'
import { tickerSelectors } from '../../../reducers/ticker'
import {
  fetchInvoices,
  searchInvoices,
  setInvoice,
  invoiceSelectors
} from '../../../reducers/invoice'
import {
  setPayment,
  fetchPayments,
  paymentSelectors
} from '../../../reducers/payment'
import { fetchTransactions } from '../../../reducers/transaction'
import { activitySelectors } from '../../../selectors'
import Activity from '../components/Activity'

const mapDispatchToProps = {
  setPayment,
  setInvoice,
  fetchPayments,
  fetchInvoices,
  fetchTransactions,
  searchInvoices
}

console.log('activitySelectors: ', activitySelectors)
const mapStateToProps = state => ({
  activity: state.activity,

  payment: state.payment,

  invoice: state.invoice,
  invoices: invoiceSelectors.invoices(state),

  ticker: state.ticker,

  paymentModalOpen: paymentSelectors.paymentModalOpen(state),
  invoiceModalOpen: invoiceSelectors.invoiceModalOpen(state),

  currentTicker: tickerSelectors.currentTicker(state),

  sortedActivity: activitySelectors.sortedActivity(state)
})

export default connect(mapStateToProps, mapDispatchToProps)(Activity)
