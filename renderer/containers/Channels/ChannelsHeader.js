import { connect } from 'react-redux'
import ChannelsHeader from 'components/Channels/ChannelsHeader'
import { openModal } from 'reducers/modal'
import {
  changeSort,
  changeFilter,
  channelsSelectors,
  fetchChannels,
  setSelectedChannel,
  setChannelViewMode,
  switchSortOrder,
  updateChannelSearchQuery,
} from 'reducers/channels'
import { infoSelectors } from 'reducers/info'
import { tickerSelectors } from 'reducers/ticker'

const mapStateToProps = state => ({
  channels: channelsSelectors.allChannels(state),
  sendCapacity: channelsSelectors.sendCapacity(state),
  receiveCapacity: channelsSelectors.receiveCapacity(state),
  channelViewMode: channelsSelectors.viewMode(state),
  cryptoUnitName: tickerSelectors.cryptoUnitName(state),
  filter: state.channels.filter,
  filters: state.channels.filters,
  sort: state.channels.sort,
  sorters: state.channels.sorters,
  sortOrder: state.channels.sortOrder,
  networkInfo: infoSelectors.networkInfo(state),
  searchQuery: state.channels.searchQuery,
  selectedChannel: channelsSelectors.selectedChannel(state),
})

const mapDispatchToProps = {
  changeFilter,
  changeSort,
  setSelectedChannel,
  setChannelViewMode,
  openModal,
  switchSortOrder,
  updateChannelSearchQuery,
  fetchChannels,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChannelsHeader)
