import { connect } from 'react-redux'
import App from '../components/App'
import { fetchTicker, setCurrency } from '../../../reducers/ticker'
import { fetchBalance } from '../../../reducers/balance'
import { fetchInfo } from '../../../reducers/info'
import { fetchPeers } from '../../../reducers/peers'
import { setAmount, setMessage, setPubkey } from '../../../reducers/payment'

const mapDispatchToProps = {
	fetchTicker,
	setCurrency,
	fetchBalance,
	fetchInfo,
	fetchPeers,
	setAmount,
	setMessage,
	setPubkey
}

const mapStateToProps = (state) => ({
	ticker: state.ticker,
	balance: state.balance,
	payment: state.payment,
	peers: state.peers
})

export default connect(mapStateToProps, mapDispatchToProps)(App)