import { connect } from 'react-redux'
import { fetchInfo } from '../../../reducers/info'
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

const mapStateToProps = (state) => ({
	info: state.info,
	ticker: state.ticker,
	
	peers: state.peers,
	channels: state.channels,

	allChannels: channelsSelectors.allChannels(state),

	peerModalOpen: peersSelectors.peerModalOpen(state),
	channelModalOpen: channelsSelectors.channelModalOpen(state),
})

export default connect(mapStateToProps, mapDispatchToProps)(Wallet)
