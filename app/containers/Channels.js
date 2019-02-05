import { connect } from 'react-redux'
import Channels from 'components/Channels'
import {
  showChannelDetail,
  updateChannelSearchQuery,
  changeFilter,
  channelsSelectors
} from 'reducers/channels'

const mapStateToProps = state => ({
  allChannels: channelsSelectors.allChannels(state),
  channels: channelsSelectors.currentChannels(state),
  channelBalance: state.balance.channelBalance,
  filter: state.channels.filter,
  filters: state.channels.filters,
  searchQuery: state.channels.searchQuery
})

const mapDispatchToProps = {
  changeFilter,
  showChannelDetail,
  updateChannelSearchQuery
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Channels)
