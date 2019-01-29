import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass'
import { Card, Heading, Text } from 'components/UI'
import { ChannelCapacity, ChannelMoreButton, ChannelStatus } from 'components/Channels'
import withEllipsis from 'components/withEllipsis'

const ClippedHeading = withEllipsis(Heading.h1)
const ClippedText = withEllipsis(Text)

const ChannelSummaryListItem = ({
  isAvailable,
  channelId,
  channelName,
  channelPubKey,
  channelPubKeyShort,
  cryptoCurrency,
  cryptoCurrencies,
  localBalance,
  remoteBalance,
  status,
  setCryptoCurrency,
  showChannelDetail,
  ...rest
}) => {
  const opacity = isAvailable ? 1 : 0.3

  return (
    <Card {...rest}>
      <Flex>
        <Box width={8 / 20}>
          <ChannelStatus status={status} />
          <ClippedHeading my={1} opacity={opacity}>
            {channelName || channelPubKeyShort}
          </ClippedHeading>
          <ClippedText fontSize="xs" opacity={opacity}>
            {channelPubKey}
          </ClippedText>
        </Box>

        <ChannelCapacity
          localBalance={localBalance}
          remoteBalance={remoteBalance}
          cryptoCurrency={cryptoCurrency}
          cryptoCurrencies={cryptoCurrencies}
          setCryptoCurrency={setCryptoCurrency}
          width={1 / 2}
          pl={4}
          pr={4}
          opacity={opacity}
        />

        <Flex width={2 / 20}>
          <ChannelMoreButton onClick={() => showChannelDetail(channelId)} ml="auto" my="auto" />
        </Flex>
      </Flex>
    </Card>
  )
}

ChannelSummaryListItem.propTypes = {
  isAvailable: PropTypes.bool.isRequired,
  channelId: PropTypes.string.isRequired,
  channelName: PropTypes.string,
  channelPubKey: PropTypes.string.isRequired,
  channelPubKeyShort: PropTypes.string.isRequired,
  cryptoCurrency: PropTypes.string.isRequired,
  cryptoCurrencies: PropTypes.array.isRequired,
  localBalance: PropTypes.number.isRequired,
  remoteBalance: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
  setCryptoCurrency: PropTypes.func.isRequired,
  showChannelDetail: PropTypes.func.isRequired
}

export default ChannelSummaryListItem
