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
	setChannel,
	channelsSelectors,
	setChannelForm
} from '../../../reducers/channels'
import Wallet from '../components/Wallet'

const mapDispatchToProps = {
	fetchInfo,
	
	fetchPeers,
	setPeer,
	connectRequest,
	disconnectRequest,
	
	fetchChannels,
	setChannel,

	setPeerForm,
	setChannelForm
}

const mapStateToProps = (state) => ({
	info: state.info,
	ticker: state.ticker,
	
	peers: state.peers,
	channels: state.channels,

	peerModalOpen: peersSelectors.peerModalOpen(state),
	channelModalOpen: channelsSelectors.channelModalOpen(state),
})

export default connect(mapStateToProps, mapDispatchToProps)(Wallet)
