import React from 'react'
import PropTypes from 'prop-types'
import { Box } from 'rebass/styled-components'
import ChannelsInfo from './ChannelsInfo'
import ChannelsActions from './ChannelsActions'

const ChannelsHeader = ({
  channels,
  channelViewMode,
  changeFilter,
  fetchChannels,
  filter,
  filters,
  sort,
  sorters,
  changeSort,
  currentChannelCount,
  updateChannelSearchQuery,
  setChannelViewMode,
  searchQuery,
  openModal,
  sortOrder,
  switchSortOrder,
  sendCapacity,
  receiveCapacity,
  ...rest
}) => (
  <Box as="header" {...rest}>
    <ChannelsInfo
      channels={channels}
      mb={2}
      pt={3}
      px={4}
      receiveCapacity={receiveCapacity}
      sendCapacity={sendCapacity}
    />
    <ChannelsActions
      changeFilter={changeFilter}
      changeSort={changeSort}
      channels={channels}
      channelViewMode={channelViewMode}
      currentChannelCount={currentChannelCount}
      fetchChannels={fetchChannels}
      filter={filter}
      filters={filters}
      mx={4}
      openModal={openModal}
      searchQuery={searchQuery}
      setChannelViewMode={setChannelViewMode}
      sort={sort}
      sorters={sorters}
      sortOrder={sortOrder}
      switchSortOrder={switchSortOrder}
      updateChannelSearchQuery={updateChannelSearchQuery}
    />
  </Box>
)

ChannelsHeader.propTypes = {
  changeFilter: PropTypes.func.isRequired,
  changeSort: PropTypes.func.isRequired,
  channels: PropTypes.array,
  channelViewMode: PropTypes.string.isRequired,
  currentChannelCount: PropTypes.number.isRequired,
  fetchChannels: PropTypes.func.isRequired,
  filter: PropTypes.string.isRequired,
  filters: PropTypes.array.isRequired,
  openModal: PropTypes.func.isRequired,
  receiveCapacity: PropTypes.number.isRequired,
  searchQuery: PropTypes.string,
  sendCapacity: PropTypes.number.isRequired,
  setChannelViewMode: PropTypes.func.isRequired,
  sort: PropTypes.string.isRequired,
  sorters: PropTypes.array.isRequired,
  sortOrder: PropTypes.string.isRequired,
  switchSortOrder: PropTypes.func.isRequired,
  updateChannelSearchQuery: PropTypes.func.isRequired,
}

ChannelsHeader.defaultProps = {
  channels: [],
}

export default ChannelsHeader
