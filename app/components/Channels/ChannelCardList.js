import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass'
import { ChannelCardListItem } from 'components/Channels'

const ChannelCardList = ({ channels, showChannelDetail, networkInfo, ...rest }) => (
  <Flex as="article" {...rest} width={1} flexWrap="wrap">
    {channels.map((channelObj, index) => {
      const channel = channelObj.channel || channelObj
      const pr = index % 2 ? 0 : 3
      const pl = index % 2 ? 3 : 0
      return (
        <Box
          width={1 / 2}
          pr={pr}
          pl={pl}
          pb={3}
          mb={3}
          key={channel.chan_id || `${channel.remote_pubkey_short}-${index}`}
        >
          <ChannelCardListItem
            showChannelDetail={showChannelDetail}
            channelId={channel.chan_id}
            channelName={channel.display_name}
            channelPubKey={channel.display_pubkey}
            channelFundingTxid={channel.channel_point.split(':')[0]}
            csvDelay={channel.csv_delay}
            numUpdates={channel.num_updates}
            localBalance={channel.local_balance}
            remoteBalance={channel.remote_balance}
            status={channel.display_status}
            isAvailable={Boolean(channel.active)}
            networkInfo={networkInfo}
          />
        </Box>
      )
    })}
  </Flex>
)

ChannelCardList.propTypes = {
  channels: PropTypes.array,
  showChannelDetail: PropTypes.func.isRequired,
  networkInfo: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  })
}

ChannelCardList.defaultProps = {
  channels: []
}

export default ChannelCardList
