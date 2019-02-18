import React from 'react'
import PropTypes from 'prop-types'
import { Box } from 'rebass'
import { ChannelsInfo, ChannelsActions } from 'components/Channels'

const ChannelsHeader = ({
  channels,
  channelBalance,
  channelViewMode,
  changeFilter,
  filter,
  filters,
  updateChannelSearchQuery,
  setChannelViewMode,
  searchQuery,
  setFormType,
  ...rest
}) => (
  <Box as="header" mb={3} {...rest}>
    <ChannelsInfo channels={channels} channelBalance={channelBalance} mb={3} />
    <ChannelsActions
      filter={filter}
      filters={filters}
      changeFilter={changeFilter}
      updateChannelSearchQuery={updateChannelSearchQuery}
      searchQuery={searchQuery}
      channelViewMode={channelViewMode}
      setChannelViewMode={setChannelViewMode}
      setFormType={setFormType}
    />
  </Box>
)

ChannelsHeader.propTypes = {
  channels: PropTypes.array,
  channelBalance: PropTypes.number.isRequired,
  filter: PropTypes.string.isRequired,
  filters: PropTypes.array.isRequired,
  searchQuery: PropTypes.string,
  changeFilter: PropTypes.func.isRequired,
  updateChannelSearchQuery: PropTypes.func.isRequired,
  channelViewMode: PropTypes.string.isRequired,
  setChannelViewMode: PropTypes.func.isRequired,
  setFormType: PropTypes.func.isRequired
}

ChannelsHeader.defaultProps = {
  channels: []
}

export default ChannelsHeader
