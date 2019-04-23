import React from 'react'
import PropTypes from 'prop-types'
import { Form, Select } from 'components/UI'
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
  <Form {...rest}>
    <Select
      field="activity-filter"
      highlightOnValid={false}
      id="activity-filter"
      initialSelectedItem={filter}
      items={filters}
      messageMapper={messageMapper}
      onValueSelected={changeFilter}
    />
  </Form>
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
