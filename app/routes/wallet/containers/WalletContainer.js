import { connect } from 'react-redux'
import { fetchInfo } from '../../../reducers/info'
import { fetchPeers } from '../../../reducers/peers'
import { fetchChannels, setChannel, channelsSelectors } from '../../../reducers/channels'
import Wallet from '../components/Wallet'

const mapDispatchToProps = {
	fetchInfo,
	
	fetchPeers,
	
	fetchChannels,
	setChannel
}

const mapStateToProps = (state) => ({
	info: state.info,
	
	peers: state.peers,
	channels: state.channels,

	channelModalOpen: channelsSelectors.channelModalOpen(state)
})

export default connect(mapStateToProps, mapDispatchToProps)(Wallet)