import React from 'react'
import PropTypes from 'prop-types'
import { Box } from 'rebass/styled-components'
import { Dropdown, Button } from 'components/UI'
import Filter from 'components/Icon/Filter'
import messages from './messages'

const messageMapper = key => {
  const filters = {
    ALL_CHANNELS: messages.channel_filter_all,
    ACTIVE_CHANNELS: messages.channel_filter_online,
    NON_ACTIVE_CHANNELS: messages.channel_filter_offline,
    OPEN_PENDING_CHANNELS: messages.channel_filter_pending,
    CLOSING_PENDING_CHANNELS: messages.channel_filter_closing,
  }

  return filters[key]
}

const IconDropdownButton = ({ onToggle, isActive }) => {
  return (
    <Button onClick={onToggle} size="small" variant="secondary">
      <Box color={isActive ? 'primaryAccent' : undefined}>
        <Filter height="16px" width="16px" />
      </Box>
    </Button>
  )
}

IconDropdownButton.propTypes = {
  isActive: PropTypes.bool,
  onToggle: PropTypes.func.isRequired,
}

const ChannelFilter = ({ changeFilter, filter, filters, isCustomFilter, ...rest }) => {
  const DropdownButton = props => <IconDropdownButton {...props} isActive={isCustomFilter} />
  return (
    <Dropdown
      {...rest}
      activeKey={filter}
      buttonComponent={DropdownButton}
      id="channel-filter"
      isMultiselect
      items={filters}
      messageMapper={messageMapper}
      onChange={changeFilter}
    />
  )
}

ChannelFilter.propTypes = {
  changeFilter: PropTypes.func.isRequired,
  filter: PropTypes.object,
  filters: PropTypes.array,
  isCustomFilter: PropTypes.bool,
}

ChannelFilter.defaultProps = {
  filters: [],
}

export default ChannelFilter
