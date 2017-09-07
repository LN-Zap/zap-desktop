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
import Activity from '../components/Activity'

const mapDispatchToProps = {
  setPayment,
  setInvoice,
  fetchPayments,
  fetchInvoices,
  searchInvoices
}

const mapStateToProps = state => ({
  activity: state.activity,

  payment: state.payment,

  invoice: state.invoice,
  invoices: invoiceSelectors.invoices(state),

  ticker: state.ticker,

  paymentModalOpen: paymentSelectors.paymentModalOpen(state),
  invoiceModalOpen: invoiceSelectors.invoiceModalOpen(state),

  currentTicker: tickerSelectors.currentTicker(state)
})

export default connect(mapStateToProps, mapDispatchToProps)(Activity)
