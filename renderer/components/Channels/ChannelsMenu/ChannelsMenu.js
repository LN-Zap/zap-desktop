import React from 'react'

import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import { Dropmenu } from 'components/UI'

import ChannelsMenuHeader from './ChannelsMenuHeader'
import ChannelsMenuSummary from './ChannelsMenuSummary'
import messages from './messages'

const ChannelsMenu = ({
  openModal,
  lightningBalance,
  channelCount,
  pendingBalance,
  onchainBalance,
  cryptoUnitName,
  ...rest
}) => {
  const items = [
    {
      type: 'content',
      id: 'header',
      content: (
        <ChannelsMenuHeader
          channelCount={channelCount}
          lightningBalance={lightningBalance}
          onchainBalance={onchainBalance}
          p={2}
          pendingBalance={pendingBalance}
        />
      ),
    },
    {
      type: 'content',
      id: 'summary',
      content: (
        <ChannelsMenuSummary
          cryptoUnitName={cryptoUnitName}
          lightningBalance={lightningBalance}
          onchainBalance={onchainBalance}
          pb={3}
          pendingBalance={pendingBalance}
          px={2}
        />
      ),
    },
    { id: 'bar1', type: 'bar' },
    {
      id: 'manage',
      title: <FormattedMessage {...messages.menu_item_channels_title} />,
      description: <FormattedMessage {...messages.menu_item_channels_description} />,
      onClick: () => openModal('CHANNELS'),
    },
    { id: 'bar2', type: 'bar' },
    {
      id: 'create',
      title: <FormattedMessage {...messages.menu_item_channel_create_title} />,
      description: <FormattedMessage {...messages.menu_item_channel_create_description} />,
      onClick: () => openModal('CHANNEL_CREATE'),
    },
  ]

  return (
    <Dropmenu items={items} justify="right" {...rest}>
      <FormattedMessage {...messages.title} />
    </Dropmenu>
  )
}

ChannelsMenu.propTypes = {
  channelCount: PropTypes.number.isRequired,
  cryptoUnitName: PropTypes.string.isRequired,
  lightningBalance: PropTypes.string.isRequired,
  onchainBalance: PropTypes.string.isRequired,
  openModal: PropTypes.func.isRequired,
  pendingBalance: PropTypes.string.isRequired,
}

export default ChannelsMenu
