import React from 'react'
import PropTypes from 'prop-types'
import { Flex } from 'rebass/styled-components'
import { Dropdown, Button } from 'components/UI'
import Settings from 'components/Icon/Settings'
import messages from './messages'

const messageMapper = key => {
  const filters = {
    SENT_ACTIVITY: messages.actiity_filter_sent,
    RECEIVED_ACTIVITY: messages.actiity_filter_received,
    PENDING_ACTIVITY: messages.actiity_filter_pending,
    EXPIRED_ACTIVITY: messages.actiity_filter_expired,
    INTERNAL_ACTIVITY: messages.actiity_filter_internal,
  }

  return filters[key]
}

const IconDropdownButton = ({ onToggle }) => {
  return (
    <Button onClick={onToggle} size="small" variant="secondary">
      <Settings height="16px" width="16px" />
    </Button>
  )
}

IconDropdownButton.propTypes = {
  onToggle: PropTypes.func.isRequired,
}

const ActivityFilter = ({ changeFilter, filter, filters, ...rest }) => (
  <Flex alignItems="baseline" {...rest}>
    <Dropdown
      activeKey={filter}
      buttonComponent={IconDropdownButton}
      highlightOnValid={false}
      id="activity-filter"
      isMultiselect
      items={filters}
      messageMapper={messageMapper}
      onChange={changeFilter}
    />
  </Flex>
)

ActivityFilter.propTypes = {
  changeFilter: PropTypes.func.isRequired,
  filter: PropTypes.object.isRequired,
  filters: PropTypes.array,
}

ActivityFilter.defaultProps = {
  filters: [],
}

export default ActivityFilter
