import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { Flex } from 'rebass'
import { Button } from 'components/UI'
import ChannelFilter from './ChannelFilter'
import ChannelSearch from './ChannelSearch'
import ChannelsRefresh from './ChannelsRefresh'
import ChannelsViewSwitcher from './ChannelsViewSwitcher'
import messages from './messages'

const ChannelsActions = ({
  fetchChannels,
  filter,
  filters,
  searchQuery,
  channelViewMode,
  changeFilter,
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
      width={7.5 / 16}
    />

    <ChannelFilter
      changeFilter={changeFilter}
      filter={filter}
      filters={filters}
      mr={1}
      width={2.5 / 16}
    />
    <ChannelsViewSwitcher
      channelViewMode={channelViewMode}
      ml={3}
      setChannelViewMode={setChannelViewMode}
    />
    <ChannelsRefresh bg="blue" ml={2} onClick={fetchChannels} />

    <Button ml="auto" onClick={() => openModal('CHANNEL_CREATE')}>
      <FormattedMessage {...messages.create_new_button_text} />
    </Button>
  </Flex>
)

ChannelsActions.propTypes = {
  changeFilter: PropTypes.func.isRequired,
  channelViewMode: PropTypes.string.isRequired,
  fetchChannels: PropTypes.func.isRequired,
  filter: PropTypes.string.isRequired,
  filters: PropTypes.array.isRequired,
  intl: intlShape.isRequired,
  openModal: PropTypes.func.isRequired,
  searchQuery: PropTypes.string,
  setChannelViewMode: PropTypes.func.isRequired,
  updateChannelSearchQuery: PropTypes.func.isRequired,
}

export default injectIntl(ChannelsActions)
