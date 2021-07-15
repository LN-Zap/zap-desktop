import React from 'react'

import PropTypes from 'prop-types'

import { Panel } from 'components/UI'

import ChannelCapacity from './ChannelCapacity'
import ChannelData from './ChannelData'
import ChannelFooter from './ChannelFooter'
import ChannelHeader from './ChannelHeader'
import { CHANNEL_DATA_VIEW_MODE_FULL } from './constants'

const ChannelDetail = ({ channel, cryptoUnitName, closeChannel, networkInfo, ...rest }) => {
  return channel ? (
    <Panel {...rest}>
      <Panel.Header mx="auto" width={9 / 16}>
        <ChannelHeader channel={channel} />
      </Panel.Header>
      <Panel.Body sx={{ overflowY: 'overlay', overflowX: 'hidden' }}>
        <ChannelCapacity
          localBalance={channel.localBalance}
          mx="auto"
          my={4}
          remoteBalance={channel.remoteBalance}
          width={9 / 16}
        />
        <ChannelData
          channel={channel}
          cryptoUnitName={cryptoUnitName}
          mx="auto"
          networkInfo={networkInfo}
          viewMode={CHANNEL_DATA_VIEW_MODE_FULL}
          width={9 / 16}
        />
      </Panel.Body>

      <Panel.Footer mt={2} px={4}>
        <ChannelFooter channel={channel} closeChannel={closeChannel} />
      </Panel.Footer>
    </Panel>
  ) : null
}

ChannelDetail.propTypes = {
  channel: PropTypes.object,
  closeChannel: PropTypes.func.isRequired,
  cryptoUnitName: PropTypes.string.isRequired,
  networkInfo: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  setSelectedChannel: PropTypes.func.isRequired,
}

export default ChannelDetail
