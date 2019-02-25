import { connect } from 'react-redux'
import { fetchPeers } from 'reducers/peers'
import { setIsWalletOpen } from 'reducers/wallet'
import { fetchActivityHistory } from 'reducers/activity'
import App from 'components/App'

const mapDispatchToProps = {
  fetchPeers,
  fetchActivityHistory,
  setIsWalletOpen
}

export default connect(
  null,
  mapDispatchToProps
)(App)
