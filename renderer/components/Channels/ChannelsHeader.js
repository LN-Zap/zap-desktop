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
  sort,
  sorters,
  changeSort,
  updateChannelSearchQuery,
  setChannelViewMode,
  searchQuery,
  openModal,
  sortOrder,
  switchSortOrder,
  ...rest
}) => (
  <Box as="header" mb={3} {...rest}>
    <ChannelsInfo channelBalance={channelBalance} channels={channels} mb={3} />
    <ChannelsActions
      changeFilter={changeFilter}
      changeSort={changeSort}
      channelViewMode={channelViewMode}
      fetchChannels={fetchChannels}
      filter={filter}
      filters={filters}
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
  channelBalance: PropTypes.number.isRequired,
  channels: PropTypes.array,
  channelViewMode: PropTypes.string.isRequired,
  fetchChannels: PropTypes.func.isRequired,
  filter: PropTypes.string.isRequired,
  filters: PropTypes.array.isRequired,
  openModal: PropTypes.func.isRequired,
  searchQuery: PropTypes.string,
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
