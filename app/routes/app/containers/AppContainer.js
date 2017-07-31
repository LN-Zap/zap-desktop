import { connect } from 'react-redux'
import App from '../components/App'
import { fetchTicker, setCurrency } from '../../../reducers/ticker'
import { fetchBalance } from '../../../reducers/balance'
import { fetchInfo } from '../../../reducers/info'
import { setForm } from '../../../reducers/form'
import { createInvoice } from '../../../reducers/invoice'
import { setAmount, setMessage, setPubkey, setPaymentRequest } from '../../../reducers/form'

const mapDispatchToProps = {
	fetchTicker,
	setCurrency,
	fetchBalance,
	fetchInfo,
	setAmount,
	setMessage,
	setPubkey,
	setPaymentRequest,
	setForm,
	createInvoice
}

const mapStateToProps = (state) => ({
	ticker: state.ticker,
	balance: state.balance,
	payment: state.payment,
	form: state.form
})

export default connect(mapStateToProps, mapDispatchToProps)(App)