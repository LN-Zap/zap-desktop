import { connect } from 'react-redux'
import { infoSelectors } from 'reducers/info'
import { newAddress } from 'reducers/address'
import { tickerSelectors } from 'reducers/ticker'
import {
  fetchPeers,
  setPeer,
  peersSelectors,
  setPeerForm,
  connectRequest,
  disconnectRequest
} from 'reducers/peers'
import {
  fetchChannels,
  fetchPendingChannels,
  setChannel,
  channelsSelectors,
  setChannelForm,
  openChannel,
  closeChannel
} from 'reducers/channels'
import Wallet from '../components/Wallet'

const mapDispatchToProps = {
  newAddress,

  fetchPeers,
  setPeer,
  connectRequest,
  disconnectRequest,

  fetchChannels,
  fetchPendingChannels,
  setChannel,
  openChannel,
  closeChannel,

  setPeerForm,
  setChannelForm
}

const mapStateToProps = state => ({
  info: state.info,
  address: state.address,
  ticker: state.ticker,

  peers: state.peers,
  channels: state.channels,

  allChannels: channelsSelectors.allChannels(state),

  peerModalOpen: peersSelectors.peerModalOpen(state),
  channelModalOpen: channelsSelectors.channelModalOpen(state),

  currentTicker: tickerSelectors.currentTicker(state),

  explorerLinkBase: infoSelectors.explorerLinkBase(state)
})

export default connect(mapStateToProps, mapDispatchToProps)(Wallet)
