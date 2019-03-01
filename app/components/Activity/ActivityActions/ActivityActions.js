import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import { Flex } from 'rebass'
import ActivityFilter from './ActivityFilter'
import ActivityRefresh from './ActivityRefresh'
import ActivitySearch from './ActivitySearch'

import messages from './messages'

const ActivityActions = ({
  filter,
  filters,
  searchQuery,
  changeFilter,
  fetchActivityHistory,
  updateActivitySearchQuery,
  intl,
  ...rest
}) => (
  <Flex as="nav" alignItems="center" {...rest}>
    <ActivitySearch
      width={13 / 16}
      placeholder={intl.formatMessage({ ...messages.search_placeholder })}
      searchQuery={searchQuery}
      updateActivitySearchQuery={updateActivitySearchQuery}
    />

    <ActivityFilter
      width={2.5 / 16}
      filter={filter}
      filters={filters}
      changeFilter={changeFilter}
      mr={1}
    />

    <Flex as="section" alignItems="center" ml={3}>
      <ActivityRefresh onClick={fetchActivityHistory} />
    </Flex>
  </Flex>
)

ActivityActions.propTypes = {
  filter: PropTypes.string.isRequired,
  filters: PropTypes.array.isRequired,
  intl: intlShape.isRequired,
  searchQuery: PropTypes.string,
  changeFilter: PropTypes.func.isRequired,
  fetchActivityHistory: PropTypes.func.isRequired,
  updateActivitySearchQuery: PropTypes.func.isRequired
}

export default injectIntl(ActivityActions)
