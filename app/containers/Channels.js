import { connect } from 'react-redux'
import Channels from 'components/Channels'
import { openModal } from 'reducers/modal'
import {
  changeFilter,
  channelsSelectors,
  fetchChannels,
  showCloseChannelDialog,
  setSelectedChannel,
  setChannelViewMode,
  updateChannelSearchQuery,
} from 'reducers/channels'
import { infoSelectors } from 'reducers/info'
import { tickerSelectors } from 'reducers/ticker'

const mapStateToProps = state => ({
  allChannels: channelsSelectors.allChannels(state),
  channels: channelsSelectors.currentChannels(state),
  channelBalance: state.balance.channelBalance,
  channelViewMode: state.channels.viewMode,
  currencyName: tickerSelectors.currencyName(state),
  filter: state.channels.filter,
  filters: state.channels.filters,
  networkInfo: infoSelectors.networkInfo(state),
  searchQuery: state.channels.searchQuery,
  selectedChannel: channelsSelectors.selectedChannel(state),
})

const mapDispatchToProps = {
  changeFilter,
  closeChannel: showCloseChannelDialog,
  setSelectedChannel,
  setChannelViewMode,
  openModal,
  updateChannelSearchQuery,
  fetchChannels,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Channels)
