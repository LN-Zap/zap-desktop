import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Flex } from 'rebass'
import { Dropdown } from 'components/UI'
import { Label } from 'components/Form'
import messages from './messages'

const messageMapper = key => {
  const filters = {
    OPEN_DATE: messages.channel_sort_open_date,
    REMOTE_BALANCE: messages.channel_sort_remote_balance,
    LOCAL_BALANCE: messages.channel_sort_local_balance,
    ACTIVITY: messages.channel_sort_activity,
    NAME: messages.channel_sort_name,
    CAPACITY: messages.channel_sort_capacity,
  }

  return filters[key]
}

const ChannelSort = ({ changeSort, sort, sorters, ...rest }) => {
  return (
    <Flex alignItems="baseline" {...rest}>
      <Label
        css={`
          white-space: nowrap;
        `}
        fontWeight="light"
        htmlFor="channel-sort"
        mr={2}
      >
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
