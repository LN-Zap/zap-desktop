import React from 'react'
import PropTypes from 'prop-types'
import { Box } from 'rebass'
import { ChannelSummaryListItem } from 'components/Channels'

const ChannelSummaryList = ({ channels, showChannelDetail, ...rest }) => (
  <Box as="article" {...rest}>
    {channels.map((channelObj, index) => {
      const channel = channelObj.channel || channelObj

      return (
        <ChannelSummaryListItem
          key={channel.chan_id || `${channel.remote_pubkey_short}-${index}`}
          showChannelDetail={showChannelDetail}
          channelId={channel.chan_id}
          channelName={channel.display_name}
          channelPubKey={channel.display_pubkey}
          localBalance={channel.local_balance}
          remoteBalance={channel.remote_balance}
          status={channel.display_status}
          isAvailable={Boolean(channel.active)}
          mb={3}
        />
      )
    })}
  </Box>
)

ChannelSummaryList.propTypes = {
  channels: PropTypes.array,
  showChannelDetail: PropTypes.func.isRequired
}

ChannelSummaryList.defaultProps = {
  channels: []
}

export default ChannelSummaryList
