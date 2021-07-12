import React from 'react'

import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'
import { Box, Flex } from 'rebass/styled-components'

import { intlShape } from '@zap/i18n'
import { Card } from 'components/UI'

import ActivityFilter from './ActivityFilter'
import ActivityRefresh from './ActivityRefresh'
import ActivitySearch from './ActivitySearch'
import messages from './messages'

const ActivityActions = ({
  filter,
  filters,
  searchText,
  changeFilter,
  reloadActivityHistory,
  updateSearchText,
  isPageLoading,
  isCustomFilter,
  intl,
  ...rest
}) => (
  <Card px={3} py={2} width={1} {...rest}>
    <Flex alignItems="center" as="section" justifyContent="space-between">
      <Box sx={{ flex: 1 }}>
        <ActivitySearch
          placeholder={intl.formatMessage({ ...messages.search_placeholder })}
          searchText={searchText}
          updateSearchText={updateSearchText}
          width={1}
        />
      </Box>
      <Flex alignItems="center" as="section" justifyContent="flex-end">
        <ActivityFilter
          changeFilter={changeFilter}
          filter={filter}
          filters={filters}
          isCustomFilter={isCustomFilter}
          mx={3}
        />

        <ActivityRefresh isPageLoading={isPageLoading} mx={3} onClick={reloadActivityHistory} />
      </Flex>
    </Flex>
  </Card>
)

ActivityActions.propTypes = {
  changeFilter: PropTypes.func.isRequired,
  filter: PropTypes.object.isRequired,
  filters: PropTypes.array.isRequired,
  intl: intlShape.isRequired,
  isCustomFilter: PropTypes.bool,
  isPageLoading: PropTypes.bool,
  reloadActivityHistory: PropTypes.func.isRequired,
  searchText: PropTypes.string,
  updateSearchText: PropTypes.func.isRequired,
}

export default injectIntl(ActivityActions)
