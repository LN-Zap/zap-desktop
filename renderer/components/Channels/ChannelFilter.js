import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Flex } from 'rebass/styled-components'
import { Dropdown } from 'components/UI'
import { Label } from 'components/Form'
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

const ChannelFilter = ({ changeFilter, filter, filters, ...rest }) => (
  <Flex alignItems="baseline" {...rest}>
    <Label
      css={`
        white-space: nowrap;
      `}
      fontWeight="light"
      htmlFor="channel-filter"
      mr={2}
    >
      <FormattedMessage {...messages.channel_filter_label} />
    </Label>
    <Dropdown
      activeKey={filter}
      id="channel-filter"
      items={filters}
      messageMapper={messageMapper}
      onChange={changeFilter}
    />
  </Flex>
)

ChannelFilter.propTypes = {
  changeFilter: PropTypes.func.isRequired,
  filter: PropTypes.string,
  filters: PropTypes.array,
}

ChannelFilter.defaultProps = {
  filters: [],
}

export default ChannelFilter
