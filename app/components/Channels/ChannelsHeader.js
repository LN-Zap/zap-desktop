import React from 'react'
import PropTypes from 'prop-types'
import { Box } from 'rebass'
import ChannelsInfo from './ChannelsInfo'
import ChannelsActions from './ChannelsActions'

const ChannelsHeader = ({
  channels,
  channelBalance,
  channelViewMode,
  changeFilter,
  fetchChannels,
  filter,
  filters,
  updateChannelSearchQuery,
  setChannelViewMode,
  searchQuery,
  openModal,
  ...rest
}) => (
  <Box as="header" mb={3} {...rest}>
    <ChannelsInfo channelBalance={channelBalance} channels={channels} mb={3} />
    <ChannelsActions
      changeFilter={changeFilter}
      channelViewMode={channelViewMode}
      fetchChannels={fetchChannels}
      filter={filter}
      filters={filters}
      openModal={openModal}
      searchQuery={searchQuery}
      setChannelViewMode={setChannelViewMode}
      updateChannelSearchQuery={updateChannelSearchQuery}
    />
  </Box>
)

ChannelsHeader.propTypes = {
  changeFilter: PropTypes.func.isRequired,
  channelBalance: PropTypes.number.isRequired,
  channels: PropTypes.array,
  channelViewMode: PropTypes.string.isRequired,
  fetchChannels: PropTypes.func.isRequired,
  filter: PropTypes.string.isRequired,
  filters: PropTypes.array.isRequired,
  openModal: PropTypes.func.isRequired,
  searchQuery: PropTypes.string,
  setChannelViewMode: PropTypes.func.isRequired,
  updateChannelSearchQuery: PropTypes.func.isRequired,
}

ChannelsHeader.defaultProps = {
  channels: [],
}

export default ChannelsHeader
