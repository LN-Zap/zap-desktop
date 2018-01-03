import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import { fetchChannels, channelsSelectors } from 'reducers/channels'

import { fetchPeers } from 'reducers/peers'

import Friends from '../components/Friends'

const mapDispatchToProps = {
  fetchChannels,
  fetchPeers
}

const mapStateToProps = state => ({
  channels: state.channels,
  peers: state.peers,

  activeChannels: channelsSelectors.activeChannels(state),
  nonActiveChannels: channelsSelectors.nonActiveChannels(state),
  pendingOpenChannels: channelsSelectors.pendingOpenChannels(state)
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Friends))
