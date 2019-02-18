import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { Flex } from 'rebass'
import { Button } from 'components/UI'
import { ChannelFilter, ChannelSearch, ChannelsViewSwitcher } from 'components/Channels'
import messages from './messages'

const ChannelsActions = ({
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
  <Flex as="section" alignItems="center" {...rest}>
    <ChannelSearch
      width={7.5 / 16}
      placeholder={intl.formatMessage({ ...messages.search_placeholder })}
      searchQuery={searchQuery}
      updateChannelSearchQuery={updateChannelSearchQuery}
    />

    <ChannelFilter
      width={2.5 / 16}
      filter={filter}
      filters={filters}
      changeFilter={changeFilter}
      mr={1}
    />
    <ChannelsViewSwitcher
      ml={3}
      channelViewMode={channelViewMode}
      setChannelViewMode={setChannelViewMode}
    />

    <Button onClick={() => openModal('CHANNEL_CREATE_FORM')} ml="auto">
      <FormattedMessage {...messages.create_new_button_text} />
    </Button>
  </Flex>
)

ChannelsActions.propTypes = {
  filter: PropTypes.string.isRequired,
  filters: PropTypes.array.isRequired,
  intl: intlShape.isRequired,
  searchQuery: PropTypes.string,
  changeFilter: PropTypes.func.isRequired,
  updateChannelSearchQuery: PropTypes.func.isRequired,
  channelViewMode: PropTypes.string.isRequired,
  setChannelViewMode: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired
}

export default injectIntl(ChannelsActions)
