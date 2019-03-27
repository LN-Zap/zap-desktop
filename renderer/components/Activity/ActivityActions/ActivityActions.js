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
  <Flex alignItems="center" as="nav" {...rest}>
    <ActivitySearch
      placeholder={intl.formatMessage({ ...messages.search_placeholder })}
      searchQuery={searchQuery}
      updateActivitySearchQuery={updateActivitySearchQuery}
      width={13 / 16}
    />

    <ActivityFilter
      changeFilter={changeFilter}
      filter={filter}
      filters={filters}
      mr={1}
      width={2.5 / 16}
    />

    <Flex alignItems="center" as="section" ml={3}>
      <ActivityRefresh onClick={fetchActivityHistory} />
    </Flex>
  </Flex>
)

ActivityActions.propTypes = {
  changeFilter: PropTypes.func.isRequired,
  fetchActivityHistory: PropTypes.func.isRequired,
  filter: PropTypes.string.isRequired,
  filters: PropTypes.array.isRequired,
  intl: intlShape.isRequired,
  searchQuery: PropTypes.string,
  updateActivitySearchQuery: PropTypes.func.isRequired,
}

export default injectIntl(ActivityActions)
