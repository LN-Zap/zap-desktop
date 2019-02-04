import { connect } from 'react-redux'
import Channels from 'components/Channels'
import { channelsSelectors, showChannelDetail } from 'reducers/channels'

const mapStateToProps = state => ({
  channels: channelsSelectors.currentChannels(state),
  channelBalance: state.balance.channelBalance
})

const mapDispatchToProps = {
  showChannelDetail
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Channels)
