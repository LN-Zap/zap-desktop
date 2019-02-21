import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { tickerSelectors } from 'reducers/ticker'
import { fetchPeers } from 'reducers/peers'
import { fetchDescribeNetwork } from 'reducers/network'
import { setIsWalletOpen } from 'reducers/wallet'
import App from 'components/App'

const mapDispatchToProps = {
  fetchPeers,
  fetchDescribeNetwork,
  setIsWalletOpen
}

const mapStateToProps = state => ({
  currentTicker: tickerSelectors.currentTicker(state)
})

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
)
