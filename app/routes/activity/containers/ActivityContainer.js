import { connect } from 'react-redux'
import { fetchInvoices, setInvoice, invoiceSelectors } from '../../../reducers/invoice'
import { setPayment, fetchPayments, paymentSelectors } from '../../../reducers/payment'
import Activity from '../components/Activity'

const mapDispatchToProps = {
	setPayment,
	setInvoice,
	fetchPayments,
	fetchInvoices
}

const mapStateToProps = (state) => ({
	activity: state.activity,
	payment: state.payment,
	invoice: state.invoice,
	ticker: state.ticker,
	paymentModalOpen: paymentSelectors.paymentModalOpen(state),
	invoiceModalOpen: invoiceSelectors.invoiceModalOpen(state)
})

export default connect(mapStateToProps, mapDispatchToProps)(Activity)