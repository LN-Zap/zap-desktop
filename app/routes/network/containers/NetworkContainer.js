import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import { fetchDescribeNetwork, setCurrentTab } from 'reducers/network'
import { fetchPeers } from 'reducers/peers'
import { fetchChannels } from 'reducers/channels'

import Network from '../components/Network'

const mapDispatchToProps = {
  setCurrentTab,
  fetchDescribeNetwork,
  fetchPeers,
  fetchChannels
}

const mapStateToProps = state => ({
  network: state.network,
  peers: state.peers,
  channels: state.channels,
  identity_pubkey: state.info.data.identity_pubkey
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Network))
