import { connect } from 'react-redux'
import Channels from 'components/Channels'
import {
  changeFilter,
  channelsSelectors,
  showChannelDetail,
  setChannelViewMode,
  updateChannelSearchQuery
} from 'reducers/channels'
import { infoSelectors } from 'reducers/info'

const mapStateToProps = state => ({
  allChannels: channelsSelectors.allChannels(state),
  channels: channelsSelectors.currentChannels(state),
  channelBalance: state.balance.channelBalance,
  channelViewMode: state.channels.viewMode,
  filter: state.channels.filter,
  filters: state.channels.filters,
  networkInfo: infoSelectors.networkInfo(state),
  searchQuery: state.channels.searchQuery
})

const mapDispatchToProps = {
  changeFilter,
  showChannelDetail,
  setChannelViewMode,
  updateChannelSearchQuery
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Channels)
