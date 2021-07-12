import React from 'react'

import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'

import Filter from 'components/Icon/Filter'
import { Dropdown } from 'components/UI'
import IconDropdownButton from 'components/UI/Dropdown/IconDropdownButton'

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

const ChannelFilter = ({ changeFilter, filter, filters, isCustomFilter, ...rest }) => {
  const intl = useIntl()
  const DropdownButton = props => (
    <IconDropdownButton
      {...props}
      hint={intl.formatMessage({ ...messages.channels_filter_hint })}
      Icon={Filter}
      isActive={isCustomFilter}
    />
  )
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
