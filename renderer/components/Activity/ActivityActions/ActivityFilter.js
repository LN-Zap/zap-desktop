import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Flex } from 'rebass/styled-components'
import { Dropdown } from 'components/UI'
import { Label } from 'components/Form'
import messages from './messages'

const messageMapper = key => {
  const filters = {
    ALL_ACTIVITY: messages.actiity_filter_all,
    SENT_ACTIVITY: messages.actiity_filter_sent,
    RECEIVED_ACTIVITY: messages.actiity_filter_received,
    PENDING_ACTIVITY: messages.actiity_filter_pending,
    EXPIRED_ACTIVITY: messages.actiity_filter_expired,
    INTERNAL_ACTIVITY: messages.actiity_filter_internal,
  }

  return filters[key]
}

const ActivityFilter = ({ changeFilter, filter, filters, ...rest }) => (
  <Flex alignItems="baseline" {...rest}>
    <Label fontWeight="light" htmlFor="channel-filter" mr={2}>
      <FormattedMessage {...messages.actiity_filter_label} />
    </Label>
    <Dropdown
      activeKey={filter}
      highlightOnValid={false}
      id="activity-filter"
      items={filters}
      messageMapper={messageMapper}
      onChange={changeFilter}
    />
  </Flex>
)

ActivityFilter.propTypes = {
  changeFilter: PropTypes.func.isRequired,
  filter: PropTypes.string,
  filters: PropTypes.array,
}

ActivityFilter.defaultProps = {
  filters: [],
}

export default ActivityFilter
