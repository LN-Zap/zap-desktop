import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import {
  fetchDescribeNetwork,

  setCurrentTab,
  updateSelectedPeers,

  networkSelectors
} from '../../../reducers/network'
import { fetchPeers } from '../../../reducers/peers'

import Network from '../components/Network'

const mapDispatchToProps = {
  fetchDescribeNetwork,
  setCurrentTab,
  updateSelectedPeers,
  
  fetchPeers
}

const mapStateToProps = state => ({
  network: state.network,
  peers: state.peers,
  identity_pubkey: state.info.data.identity_pubkey,

  selectedPeerPubkeys: networkSelectors.selectedPeerPubkeys(state)
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Network))
