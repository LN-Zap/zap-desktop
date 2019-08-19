import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Box, Flex } from 'rebass/styled-components'
import { themeGet } from '@styled-system/theme-get'
import styled from 'styled-components'
import { intlShape } from '@zap/i18n'
import { ButtonCreate, Card, Text } from 'components/UI'
import ChannelFilter from './ChannelFilter'
import ChannelSort from './ChannelSort'
import ChannelSearch from './ChannelSearch'
import ChannelsRefresh from './ChannelsRefresh'
import ChannelsViewButtons from './ChannelsViewButtons'
import ChannelSortDirectionButton from './ChannelSortDirectionButton'
import ChannelCount from './ChannelCount'
import messages from './messages'

const ResetSearchText = styled(Text)`
  &:hover {
    color: ${themeGet('colors.lightningOrange')};
  }
  cursor: pointer;
`

const ResetSearch = ({ onClick }) => {
  return (
    <ResetSearchText color="gray" onClick={onClick}>
      {`(`}
      <FormattedMessage {...messages.show_all} />
      {`)`}
    </ResetSearchText>
  )
}

ResetSearch.propTypes = {
  onClick: PropTypes.func.isRequired,
}

const ChannelsActions = ({
  fetchChannels,
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
  intl,
  ...rest
}) => (
  <Box {...rest}>
    <Card px={3} py={2} width={1}>
      <Flex alignItems="center" as="section" justifyContent="space-between">
        <ChannelSearch
          placeholder={intl.formatMessage({ ...messages.search_placeholder })}
          searchQuery={searchQuery}
          updateChannelSearchQuery={updateChannelSearchQuery}
          width={1}
        />
        <Flex alignItems="center" as="section" justifyContent="flex-end">
          <ChannelFilter changeFilter={changeFilter} filter={filter} filters={filters} mx={3} />
          <ChannelSort changeSort={changeSort} mx={3} sort={sort} sorters={sorters} />
          <ChannelSortDirectionButton isAsc={sortOrder === 'asc'} onClick={switchSortOrder} />
          <ChannelsRefresh onClick={fetchChannels} />
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
              changeFilter('ALL_CHANNELS')
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
  fetchChannels: PropTypes.func.isRequired,
  filter: PropTypes.string.isRequired,
  filters: PropTypes.array.isRequired,
  intl: intlShape.isRequired,
  openModal: PropTypes.func.isRequired,
  searchQuery: PropTypes.string,
  setChannelViewMode: PropTypes.func.isRequired,
  sort: PropTypes.string.isRequired,
  sorters: PropTypes.array.isRequired,
  sortOrder: PropTypes.string.isRequired,
  switchSortOrder: PropTypes.func.isRequired,
  updateChannelSearchQuery: PropTypes.func.isRequired,
}

export default injectIntl(ChannelsActions)
