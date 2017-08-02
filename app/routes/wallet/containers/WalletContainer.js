import { connect } from 'react-redux'
import { fetchInfo } from '../../../reducers/info'
import { fetchPeers } from '../../../reducers/peers'
import { fetchChannels } from '../../../reducers/channels'
import Wallet from '../components/Wallet'

const mapDispatchToProps = {
	fetchInfo,
	fetchPeers,
	fetchChannels
}

const mapStateToProps = (state) => ({
	info: state.info,
	peers: state.peers,
	channels: state.channels
})

export default connect(mapStateToProps, mapDispatchToProps)(Wallet)