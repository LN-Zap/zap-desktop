import React from 'react'

import isEqual from 'lodash/isEqual'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass/styled-components'

import Padlock from 'components/Icon/Padlock'
import { Card, Heading, Text } from 'components/UI'
import { withEllipsis } from 'hocs'

import ChannelCapacity from './ChannelCapacity'
import ChannelMoreButton from './ChannelMoreButton'
import ChannelStatus from './ChannelStatus'

const ClippedHeading = withEllipsis(Heading.H1)
const ClippedText = withEllipsis(Text)

const areEqual = (prevProps, nextProps) => isEqual(prevProps, nextProps)

const ChannelSummaryListItem = React.memo(props => {
  const { channel, openModal, setSelectedChannel, ...rest } = props

  const {
    channelPoint,
    displayName,
    displayPubkey,
    localBalance,
    remoteBalance,
    displayStatus,
    active,
    private: isPrivate,
  } = channel
  const opacity = active ? 1 : 0.3

  return (
    <Card {...rest}>
      <Flex alignItems="center">
        <Box width={8 / 20}>
          <Flex>
            <ChannelStatus status={displayStatus} />
            {isPrivate && (
              <Box color="gray" fontSize="s" ml={1}>
                <Padlock />
              </Box>
            )}
          </Flex>
          <ClippedHeading my={1} opacity={opacity}>
            {displayName}
          </ClippedHeading>
          <ClippedText fontSize="xs" opacity={opacity}>
            {displayPubkey}
          </ClippedText>
        </Box>

        <ChannelCapacity
          localBalance={localBalance}
          opacity={opacity}
          pl={4}
          pr={4}
          remoteBalance={remoteBalance}
          width={1 / 2}
        />

        <Flex alignItems="center" flexDirection="column" width={2 / 20}>
          <ChannelMoreButton
            isDisabled={!channelPoint}
            onClick={() => {
              setSelectedChannel(channelPoint)
              openModal('CHANNEL_DETAIL')
            }}
          />
        </Flex>
      </Flex>
    </Card>
  )
}, areEqual)

ChannelSummaryListItem.displayName = 'ChannelSummaryListItem'

ChannelSummaryListItem.propTypes = {
  channel: PropTypes.object.isRequired,
  openModal: PropTypes.func.isRequired,
  setSelectedChannel: PropTypes.func.isRequired,
}

export default ChannelSummaryListItem
