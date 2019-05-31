import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { Box, Flex } from 'rebass'
import { ButtonCreate, Card } from 'components/UI'
import ChannelFilter from './ChannelFilter'
import ChannelSort from './ChannelSort'
import ChannelSearch from './ChannelSearch'
import ChannelsRefresh from './ChannelsRefresh'
import ChannelsViewButtons from './ChannelsViewButtons'
import ChannelSortDirectionButton from './ChannelSortDirectionButton'
import ChannelCount from './ChannelCount'

import messages from './messages'

const ChannelsActions = ({
  fetchChannels,
  filter,
  filters,
  sort,
  sorters,
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
          width={1 / 3}
        />
        <Flex alignItems="center" as="section" justifyContent="flex-end" width={2 / 3}>
          <ChannelFilter changeFilter={changeFilter} filter={filter} filters={filters} mx={3} />
          <ChannelSort changeSort={changeSort} ml={3} sort={sort} sorters={sorters} />
          <ChannelSortDirectionButton
            isAsc={sortOrder === 'asc'}
            mr={3}
            onClick={switchSortOrder}
          />
          <ChannelsViewButtons
            channelViewMode={channelViewMode}
            setChannelViewMode={setChannelViewMode}
          />
          <ChannelsRefresh ml={2} onClick={fetchChannels} />
        </Flex>
      </Flex>
    </Card>
    <Flex alignItems="center" as="section" justifyContent="space-between" mb={1} mt={2}>
      <ChannelCount channels={channels} mr={4} />
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
