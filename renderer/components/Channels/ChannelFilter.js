import React from 'react'
import PropTypes from 'prop-types'
import { Form, Select } from 'components/UI'
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
  <Form {...rest}>
    <Select
      field="channel-filter"
      highlightOnValid={false}
      id="channel-filter"
      initialSelectedItem={filter}
      items={filters}
      messageMapper={messageMapper}
      onValueSelected={changeFilter}
      width={1}
    />
  </Form>
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
