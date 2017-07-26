import { connect } from 'react-redux'
import App from '../components/App'
import { fetchTicker } from '../../../reducers/ticker'
import { fetchBalance } from '../../../reducers/balance'
import { fetchInfo } from '../../../reducers/info'

const mapDispatchToProps = {
	fetchTicker,
	fetchBalance,
	fetchInfo
}

const mapStateToProps = (state) => ({
	ticker: state.ticker,
	balance: state.balance
})

export default connect(mapStateToProps, mapDispatchToProps)(App)