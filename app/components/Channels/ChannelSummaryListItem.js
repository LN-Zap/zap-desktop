import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass'
import { Card, Heading, Text } from 'components/UI'
import { withEllipsis } from 'hocs'
import ChannelCapacity from './ChannelCapacity'
import ChannelMoreButton from './ChannelMoreButton'
import ChannelStatus from './ChannelStatus'

const ClippedHeading = withEllipsis(Heading.h1)
const ClippedText = withEllipsis(Text)

const ChannelSummaryListItem = React.memo(props => {
  const { channel, openModal, setSelectedChannel, ...rest } = props
  const {
    channel_point,
    display_name,
    display_pubkey,
    local_balance,
    remote_balance,
    display_status,
    active
  } = channel
  const opacity = active ? 1 : 0.3

  return (
    <Card {...rest}>
      <Flex alignItems="center">
        <Box width={8 / 20}>
          <ChannelStatus status={display_status} />
          <ClippedHeading my={1} opacity={opacity}>
            {display_name}
          </ClippedHeading>
          <ClippedText fontSize="xs" opacity={opacity}>
            {display_pubkey}
          </ClippedText>
        </Box>

        <ChannelCapacity
          localBalance={local_balance}
          remoteBalance={remote_balance}
          width={1 / 2}
          pl={4}
          pr={4}
          opacity={opacity}
        />

        <Flex width={2 / 20} alignItems="center" flexDirection="column">
          <ChannelMoreButton
            onClick={() => {
              setSelectedChannel(channel_point)
              openModal('CHANNEL_DETAIL')
            }}
          />
        </Flex>
      </Flex>
    </Card>
  )
})

ChannelSummaryListItem.displayName = 'ChannelSummaryListItem'

ChannelSummaryListItem.propTypes = {
  channel: PropTypes.object.isRequired,
  openModal: PropTypes.func.isRequired,
  setSelectedChannel: PropTypes.func.isRequired
}

export default ChannelSummaryListItem
