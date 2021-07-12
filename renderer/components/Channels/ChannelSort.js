import React from 'react'

import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Flex } from 'rebass/styled-components'

import { Label } from 'components/Form'
import { Dropdown } from 'components/UI'

import messages from './messages'

const messageMapper = key => {
  const filters = {
    CHANNELS_SORT_OPEN_DATE: messages.channel_sort_open_date,
    CHANNELS_SORT_REMOTE_BALANCE: messages.channel_sort_remote_balance,
    CHANNELS_SORT_LOCAL_BALANCE: messages.channel_sort_local_balance,
    CHANNELS_SORT_ACTIVITY: messages.channel_sort_activity,
    CHANNELS_SORT_NAME: messages.channel_sort_name,
    CHANNELS_SORT_CAPACITY: messages.channel_sort_capacity,
  }

  return filters[key]
}

const ChannelSort = ({ changeSort, sort, sorters, ...rest }) => {
  return (
    <Flex alignItems="baseline" {...rest}>
      <Label css="white-space: nowrap;" fontWeight="light" htmlFor="channel-sort" mr={2}>
        <FormattedMessage {...messages.channel_sort_label} />
      </Label>
      <Dropdown
        activeKey={sort}
        id="channel-sort"
        items={sorters}
        messageMapper={messageMapper}
        onChange={changeSort}
      />
    </Flex>
  )
}

ChannelSort.propTypes = {
  changeSort: PropTypes.func.isRequired,
  sort: PropTypes.string,
  sorters: PropTypes.array,
}

ChannelSort.defaultProps = {
  sort: [],
}

export default ChannelSort
