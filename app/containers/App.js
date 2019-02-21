import { connect } from 'react-redux'
import { fetchPeers } from 'reducers/peers'
import { fetchDescribeNetwork } from 'reducers/network'
import { setIsWalletOpen } from 'reducers/wallet'
import App from 'components/App'

const mapDispatchToProps = {
  fetchPeers,
  fetchDescribeNetwork,
  setIsWalletOpen
}

export default connect(
  null,
  mapDispatchToProps
)(App)
