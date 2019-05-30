import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { Flex } from 'rebass'
import { Button } from 'components/UI'
import ChannelFilter from './ChannelFilter'
import ChannelSort from './ChannelSort'
import ChannelSearch from './ChannelSearch'
import ChannelsRefresh from './ChannelsRefresh'
import ChannelsViewSwitcher from './ChannelsViewSwitcher'
import ChannelSortDirectionButton from './ChannelSortDirectionButton'

import messages from './messages'

const ChannelsActions = ({
  fetchChannels,
  filter,
  filters,
  sort,
  sorters,
  sortOrder,
  searchQuery,
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
  <Flex alignItems="center" as="section" {...rest}>
    <ChannelSearch
      placeholder={intl.formatMessage({ ...messages.search_placeholder })}
      searchQuery={searchQuery}
      updateChannelSearchQuery={updateChannelSearchQuery}
      width={5.5 / 16}
    />

    <ChannelFilter
      changeFilter={changeFilter}
      filter={filter}
      filters={filters}
      mr={1}
      width={2.6 / 16}
    />

    <ChannelSort changeSort={changeSort} mr={1} sort={sort} sorters={sorters} width={2.6 / 16} />
    <ChannelSortDirectionButton isAsc={sortOrder === 'asc'} onClick={switchSortOrder} />
    <ChannelsViewSwitcher
      channelViewMode={channelViewMode}
      setChannelViewMode={setChannelViewMode}
    />
    <ChannelsRefresh ml={2} onClick={fetchChannels} />

    <Button ml="auto" onClick={() => openModal('CHANNEL_CREATE')}>
      <FormattedMessage {...messages.create_new_button_text} />
    </Button>
  </Flex>
)

ChannelsActions.propTypes = {
  changeFilter: PropTypes.func.isRequired,
  changeSort: PropTypes.func.isRequired,
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
