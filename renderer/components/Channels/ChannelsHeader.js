import React from 'react'

import PropTypes from 'prop-types'
import { Box } from 'rebass/styled-components'

import ChannelsActions from './ChannelsActions'
import ChannelsInfo from './ChannelsInfo'

const ChannelsHeader = ({
  channels,
  channelViewMode,
  changeFilter,
  refreshChannels,
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
  isCustomFilter,
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
      filter={filter}
      filters={filters}
      isCustomFilter={isCustomFilter}
      mx={4}
      openModal={openModal}
      refreshChannels={refreshChannels}
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
  filter: PropTypes.object.isRequired,
  filters: PropTypes.array.isRequired,
  isCustomFilter: PropTypes.bool,
  openModal: PropTypes.func.isRequired,
  receiveCapacity: PropTypes.string.isRequired,
  refreshChannels: PropTypes.func.isRequired,
  searchQuery: PropTypes.string,
  sendCapacity: PropTypes.string.isRequired,
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
