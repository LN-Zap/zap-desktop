import { connect } from 'react-redux'
import Channels from 'components/Channels'
import { openModal } from 'reducers/modal'
import {
  changeSort,
  changeFilter,
  channelsSelectors,
  fetchChannels,
  showCloseChannelDialog,
  setSelectedChannel,
  setChannelViewMode,
  switchSortOrder,
  updateChannelSearchQuery,
} from 'reducers/channels'
import { infoSelectors } from 'reducers/info'
import { tickerSelectors } from 'reducers/ticker'

const mapStateToProps = state => ({
  allChannels: channelsSelectors.allChannels(state),
  channels: channelsSelectors.currentChannels(state),
  channelBalance: state.balance.channelBalance,
  channelViewMode: state.channels.viewMode,
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
  closeChannel: showCloseChannelDialog,
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
)(Channels)
