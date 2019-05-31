import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Flex } from 'rebass'
import { Form, Label, Select } from 'components/UI'
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
    <Flex alignItems="center">
      <Label fontWeight="light" htmlFor="channel-filter" mr={2}>
        <FormattedMessage {...messages.channel_filter_label} />
      </Label>
      <Select
        field="channel-filter"
        fontWeight="normal"
        highlightOnValid={false}
        id="channel-filter"
        initialSelectedItem={filter}
        items={filters}
        messageMapper={messageMapper}
        onValueSelected={changeFilter}
      />
    </Flex>
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
