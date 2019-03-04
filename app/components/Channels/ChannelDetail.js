import React from 'react'
import PropTypes from 'prop-types'
import { Panel } from 'components/UI'
import ChannelCapacity from './ChannelCapacity'
import ChannelData from './ChannelData'
import ChannelFooter from './ChannelFooter'
import ChannelHeader from './ChannelHeader'
import { CHANNEL_DATA_VIEW_MODE_FULL } from './constants'

const ChannelDetail = ({
  channel,
  currencyName,
  closeChannel,
  setSelectedChannel,
  networkInfo,
  ...rest
}) => (
  <Panel {...rest}>
    <Panel.Header width={9 / 16} mx="auto">
      <ChannelHeader channel={channel} />
    </Panel.Header>
    <Panel.Body css={{ 'overflow-y': 'overlay', 'overflow-x': 'hidden' }}>
      <ChannelCapacity
        localBalance={channel.local_balance}
        remoteBalance={channel.remote_balance}
        width={9 / 16}
        mx="auto"
        my={4}
      />
      <ChannelData
        channel={channel}
        currencyName={currencyName}
        networkInfo={networkInfo}
        viewMode={CHANNEL_DATA_VIEW_MODE_FULL}
        width={9 / 16}
        mx="auto"
      />
    </Panel.Body>

    <Panel.Footer px={4} mt={2}>
      <ChannelFooter channel={channel} closeChannel={closeChannel} />
    </Panel.Footer>
  </Panel>
)

ChannelDetail.propTypes = {
  channel: PropTypes.object.isRequired,
  currencyName: PropTypes.string.isRequired,
  closeChannel: PropTypes.func.isRequired,
  setSelectedChannel: PropTypes.func.isRequired,
  networkInfo: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  })
}

export default ChannelDetail
