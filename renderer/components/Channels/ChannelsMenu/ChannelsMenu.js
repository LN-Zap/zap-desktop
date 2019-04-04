import React from 'react'
import PropTypes from 'prop-types'
import { Card } from 'components/UI'
import { FormattedMessage } from 'react-intl'
import ChannelsMenuHeader from './ChannelsMenuHeader'
import ChannelsMenuSummary from './ChannelsMenuSummary'
import ChannelsMenuItem from './ChannelsMenuItem'
import messages from './messages'

const ChannelsMenu = ({
  openModal,
  lightningBalance,
  channelCount,
  pendingBalance,
  onchainBalance,
  currencyName,
  ...rest
}) => (
  <Card p={0} {...rest}>
    <ChannelsMenuHeader
      channelCount={channelCount}
      lightningBalance={lightningBalance}
      onchainBalance={onchainBalance}
      p={3}
      pendingBalance={pendingBalance}
    />

    <ChannelsMenuSummary
      currencyName={currencyName}
      lightningBalance={lightningBalance}
      onchainBalance={onchainBalance}
      p2={3}
      pb={3}
      pendingBalance={pendingBalance}
      px={3}
    />

    <ChannelsMenuItem
      description={<FormattedMessage {...messages.menu_item_channels_description} />}
      onClick={() => openModal('CHANNELS')}
      title={<FormattedMessage {...messages.menu_item_channels_title} />}
    />

    <ChannelsMenuItem
      description={<FormattedMessage {...messages.menu_item_channel_create_description} />}
      onClick={() => {
        openModal('CHANNELS')
        openModal('CHANNEL_CREATE')
      }}
      title={<FormattedMessage {...messages.menu_item_channel_create_title} />}
    />
  </Card>
)

ChannelsMenu.propTypes = {
  channelCount: PropTypes.number.isRequired,
  currencyName: PropTypes.string.isRequired,
  lightningBalance: PropTypes.number.isRequired,
  onchainBalance: PropTypes.number.isRequired,
  openModal: PropTypes.func.isRequired,
  pendingBalance: PropTypes.number.isRequired,
}

ChannelsMenu.displayName = 'ChannelsMenu'

// const WrappedChannelsMenu = React.forwardRef((props, ref) => <ChannelsMenu {...props} ref={ref} />)
//
// WrappedChannelsMenu.displayName = 'WrappedChannelsMenu'

export default ChannelsMenu
