import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass'
import { Card } from 'components/UI'
import { ChannelCardListItem } from 'components/Channels'

const ChannelCardList = ({
  channels,
  currencyName,
  openModal,
  setSelectedChannel,
  networkInfo,
  ...rest
}) => (
  <Flex as="article" {...rest} width={1} flexWrap="wrap">
    {channels.map((channelObj, index) => {
      const channel = channelObj.channel || channelObj
      return (
        <Box
          width={1 / 2}
          pr={index % 2 ? 0 : 3}
          pl={index % 2 ? 3 : 0}
          pb={3}
          mb={3}
          key={channel.channel_point}
        >
          <Card>
            <ChannelCardListItem
              channel={channel}
              currencyName={currencyName}
              openModal={openModal}
              setSelectedChannel={setSelectedChannel}
              networkInfo={networkInfo}
            />
          </Card>
        </Box>
      )
    })}
  </Flex>
)

ChannelCardList.propTypes = {
  channels: PropTypes.array,
  currencyName: PropTypes.string.isRequired,
  openModal: PropTypes.func.isRequired,
  setSelectedChannel: PropTypes.func.isRequired,
  networkInfo: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  })
}

ChannelCardList.defaultProps = {
  channels: []
}

export default ChannelCardList
