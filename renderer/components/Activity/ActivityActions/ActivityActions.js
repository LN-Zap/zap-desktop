import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import { Flex } from 'rebass'
import { Card } from 'components/UI'
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
  <Card px={3} py={2} width={1} {...rest}>
    <Flex alignItems="center" as="section" justifyContent="space-between">
      <ActivitySearch
        placeholder={intl.formatMessage({ ...messages.search_placeholder })}
        searchQuery={searchQuery}
        updateActivitySearchQuery={updateActivitySearchQuery}
        width={1}
      />
      <Flex alignItems="center" as="section" justifyContent="flex-end">
        <ActivityFilter changeFilter={changeFilter} filter={filter} filters={filters} mx={3} />

        <ActivityRefresh mx={3} onClick={fetchActivityHistory} />
      </Flex>
    </Flex>
  </Card>
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
