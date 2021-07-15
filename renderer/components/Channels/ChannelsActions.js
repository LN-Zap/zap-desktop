import React from 'react'

import { themeGet } from '@styled-system/theme-get'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Box, Flex } from 'rebass/styled-components'
import styled from 'styled-components'

import { intlShape } from '@zap/i18n'
import { ButtonCreate, Card, Text } from 'components/UI'

import ChannelCount from './ChannelCount'
import ChannelFilter from './ChannelFilter'
import ChannelSearch from './ChannelSearch'
import ChannelSort from './ChannelSort'
import ChannelSortDirectionButton from './ChannelSortDirectionButton'
import ChannelsRefresh from './ChannelsRefresh'
import ChannelsViewButtons from './ChannelsViewButtons'
import messages from './messages'

const ResetSearchText = styled(Text)`
  &:hover {
    color: ${themeGet('colors.primaryAccent')};
  }
  cursor: pointer;
`

const ResetSearch = ({ onClick }) => {
  return (
    <ResetSearchText color="gray" onClick={onClick}>
      <FormattedMessage {...messages.show_all} />
    </ResetSearchText>
  )
}

ResetSearch.propTypes = {
  onClick: PropTypes.func.isRequired,
}

const ChannelsActions = ({
  refreshChannels,
  filter,
  filters,
  sort,
  sorters,
  currentChannelCount,
  sortOrder,
  searchQuery,
  channels,
  channelViewMode,
  changeFilter,
  changeSort,
  switchSortOrder,
  updateChannelSearchQuery,
  setChannelViewMode,
  openModal,
  isCustomFilter,
  intl,
  ...rest
}) => (
  <Box {...rest}>
    <Card px={3} py={2} width={1}>
      <Flex alignItems="center" as="section" justifyContent="space-between" width={1}>
        <Box sx={{ flex: 1 }}>
          <ChannelSearch
            placeholder={intl.formatMessage({ ...messages.search_placeholder })}
            searchQuery={searchQuery}
            updateChannelSearchQuery={updateChannelSearchQuery}
            width={1}
          />
        </Box>
        <Flex alignItems="center" justifyContent="flex-end">
          <ChannelSort changeSort={changeSort} mx={2} sort={sort} sorters={sorters} />
          <ChannelSortDirectionButton
            isAsc={sortOrder === 'asc'}
            mx={2}
            onClick={switchSortOrder}
          />
          <ChannelFilter
            changeFilter={changeFilter}
            filter={filter}
            filters={filters}
            isCustomFilter={isCustomFilter}
            mx={2}
          />
          <ChannelsRefresh mx={2} onClick={refreshChannels} />
          <ChannelsViewButtons
            channelViewMode={channelViewMode}
            setChannelViewMode={setChannelViewMode}
          />
        </Flex>
      </Flex>
    </Card>
    <Flex alignItems="center" as="section" justifyContent="space-between" my={3}>
      <Flex mr={4}>
        <ChannelCount count={currentChannelCount} totalCount={channels.length} />
        {currentChannelCount !== channels.length && (
          <ResetSearch
            onClick={() => {
              changeFilter()
              updateChannelSearchQuery(null)
            }}
          />
        )}
      </Flex>

      <ButtonCreate justify="right" ml="auto" onClick={() => openModal('CHANNEL_CREATE')}>
        <FormattedMessage {...messages.create_new_button_text} />
      </ButtonCreate>
    </Flex>
  </Box>
)

ChannelsActions.propTypes = {
  changeFilter: PropTypes.func.isRequired,
  changeSort: PropTypes.func.isRequired,
  channels: PropTypes.array.isRequired,
  channelViewMode: PropTypes.string.isRequired,
  currentChannelCount: PropTypes.number.isRequired,
  filter: PropTypes.object.isRequired,
  filters: PropTypes.array.isRequired,
  intl: intlShape.isRequired,
  isCustomFilter: PropTypes.bool,
  openModal: PropTypes.func.isRequired,
  refreshChannels: PropTypes.func.isRequired,
  searchQuery: PropTypes.string,
  setChannelViewMode: PropTypes.func.isRequired,
  sort: PropTypes.string.isRequired,
  sorters: PropTypes.array.isRequired,
  sortOrder: PropTypes.string.isRequired,
  switchSortOrder: PropTypes.func.isRequired,
  updateChannelSearchQuery: PropTypes.func.isRequired,
}

export default injectIntl(ChannelsActions)
