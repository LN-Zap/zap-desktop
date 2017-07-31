import { connect } from 'react-redux'
import { fetchInvoices } from '../../../reducers/invoice'
import { fetchPayments } from '../../../reducers/payment'
import Activity from '../components/Activity'

const mapDispatchToProps = {
	fetchPayments,
	fetchInvoices
}

const mapStateToProps = (state) => ({
	activity: state.activity,
	payment: state.payment,
	invoice: state.invoice,
	ticker: state.ticker
})

export default connect(mapStateToProps, mapDispatchToProps)(Activity)