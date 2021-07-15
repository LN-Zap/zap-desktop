import React from 'react'

import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'

import Filter from 'components/Icon/Filter'
import { Dropdown } from 'components/UI'
import IconDropdownButton from 'components/UI/Dropdown/IconDropdownButton'

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

const ActivityFilter = ({ changeFilter, isCustomFilter, filter, filters, ...rest }) => {
  const intl = useIntl()
  const DropdownButton = props => (
    <IconDropdownButton
      hint={intl.formatMessage({ ...messages.activity_filter_hint })}
      Icon={Filter}
      {...props}
      isActive={isCustomFilter}
    />
  )
  return (
    <Dropdown
      {...rest}
      activeKey={filter}
      buttonComponent={DropdownButton}
      highlightOnValid={false}
      id="activity-filter"
      isMultiselect
      items={filters}
      justify="right"
      messageMapper={messageMapper}
      onChange={changeFilter}
    />
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
