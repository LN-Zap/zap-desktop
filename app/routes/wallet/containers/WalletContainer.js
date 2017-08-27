import { connect } from 'react-redux'
import { newAddress } from '../../../reducers/address'
import { fetchInfo } from '../../../reducers/info'
import { tickerSelectors } from '../../../reducers/ticker'
import {
  fetchPeers,
  setPeer,
  peersSelectors,
  setPeerForm,
  connectRequest,
  disconnectRequest
} from '../../../reducers/peers'
import {
  fetchChannels,
  fetchPendingChannels,
  setChannel,
  channelsSelectors,
  setChannelForm,
  openChannel
} from '../../../reducers/channels'
import Wallet from '../components/Wallet'

const mapDispatchToProps = {
  newAddress,

  fetchInfo,

  fetchPeers,
  setPeer,
  connectRequest,
  disconnectRequest,

  fetchChannels,
  fetchPendingChannels,
  setChannel,
  openChannel,

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

  currentTicker: tickerSelectors.currentTicker(state)
})

export default connect(mapStateToProps, mapDispatchToProps)(Wallet)
