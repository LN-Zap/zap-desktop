import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import styled from 'styled-components'
import { opacity, height } from 'styled-system'
import { Box as BaseBox, Flex as BaseFlex } from 'rebass'
import { Bar, Card, DataRow, Heading, Link, Text } from 'components/UI'
import { ChannelCapacity, ChannelMoreButton, ChannelStatus } from 'components/Channels'
import { blockExplorer } from 'lib/utils'
import { Truncate } from 'components/Util'
import withEllipsis from 'components/withEllipsis'
import messages from './messages'

const ClippedHeading = withEllipsis(Heading.h1)
const ClippedText = withEllipsis(Text)
const Box = styled(BaseBox)(opacity)
const Flex = styled(BaseFlex)(opacity, height)

const ChannelCardListItem = ({
  intl,
  isAvailable,
  channelId,
  channelName,
  channelPubKey,
  channelPubKeyShort,
  channelFundingTxid,
  numUpdates,
  csvDelay,
  localBalance,
  remoteBalance,
  status,
  showChannelDetail,
  networkInfo,
  ...rest
}) => {
  const opacity = isAvailable ? 1 : 0.3

  return (
    <Card {...rest}>
      <Box as="header">
        <Flex justifyContent="space-between">
          <ClippedHeading my={1} opacity={opacity}>
            {channelName}
          </ClippedHeading>

          <ChannelStatus status={status} mb="auto" />
        </Flex>
        <Flex justifyContent="space-between" opacity={opacity}>
          <Text fontWeight="normal">
            <FormattedMessage {...messages.remote_pubkey} />
          </Text>
          <ClippedText width={2 / 3}>{channelPubKey}</ClippedText>
        </Flex>
        <Box opacity={opacity}>
          <Bar my={2} opacity={0.3} />
        </Box>
      </Box>

      <ChannelCapacity
        localBalance={localBalance}
        remoteBalance={remoteBalance}
        opacity={opacity}
        my={4}
      />

      <Box as="section" opacity={opacity}>
        <Bar opacity={0.3} />
        <DataRow
          left={intl.formatMessage({ ...messages.funding_transaction })}
          right={
            <Link
              onClick={() =>
                networkInfo && blockExplorer.showTransaction(networkInfo, channelFundingTxid)
              }
            >
              <Truncate text={channelFundingTxid} maxlen={25} />
            </Link>
          }
          py={2}
        />
        <Bar opacity={0.3} />
        <DataRow left={intl.formatMessage({ ...messages.num_updates })} right={numUpdates} py={2} />
        <Bar opacity={0.3} />
        <DataRow left={intl.formatMessage({ ...messages.cvs_delay })} right={csvDelay} py={2} />
      </Box>

      <Flex as="footer" justifyContent="center" height="40px" alignItems="flex-end">
        {channelId && <ChannelMoreButton onClick={() => showChannelDetail(channelId)} />}
      </Flex>
    </Card>
  )
}

ChannelCardListItem.propTypes = {
  intl: intlShape.isRequired,
  isAvailable: PropTypes.bool.isRequired,
  channelId: PropTypes.number,
  channelName: PropTypes.string,
  channelPubKey: PropTypes.string.isRequired,
  channelFundingTxid: PropTypes.string.isRequired,
  numUpdates: PropTypes.number,
  csvDelay: PropTypes.number,
  localBalance: PropTypes.number.isRequired,
  remoteBalance: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
  showChannelDetail: PropTypes.func.isRequired,
  networkInfo: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  })
}

ChannelCardListItem.defaultProps = {
  numUpdates: 0,
  csvDelay: 0
}

export default injectIntl(ChannelCardListItem)
