import React from 'react'
import PropTypes from 'prop-types'
import { Flex, Box } from 'rebass/styled-components'
import { Dropdown, Button } from 'components/UI'
import Filter from 'components/Icon/Filter'
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

const ActivityFilter = ({ changeFilter, isCustomFilter, filter, filters, ...rest }) => {
  const DropdownButton = props => <IconDropdownButton {...props} isActive={isCustomFilter} />
  return (
    <Flex alignItems="baseline" {...rest}>
      <Dropdown
        activeKey={filter}
        buttonComponent={DropdownButton}
        highlightOnValid={false}
        id="activity-filter"
        isMultiselect
        items={filters}
        messageMapper={messageMapper}
        onChange={changeFilter}
      />
    </Flex>
  )
}

ActivityFilter.propTypes = {
  changeFilter: PropTypes.func.isRequired,
  filter: PropTypes.object.isRequired,
  filters: PropTypes.array,
  isCustomFilter: PropTypes.bool,
}

ActivityFilter.defaultProps = {
  filters: [],
}

export default ActivityFilter
