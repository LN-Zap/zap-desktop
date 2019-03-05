import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass'
import { FormattedMessage } from 'react-intl'
import BigArrowRight from 'components/Icon/BigArrowRight'
import { Bar, DataRow, Text } from 'components/UI'
import { CryptoSelector, CryptoValue, FiatValue } from 'containers/UI'
import { Truncate } from 'components/Util'
import { withEllipsis } from 'hocs'
import {
  TRANSACTION_SPEED_SLOW,
  TRANSACTION_SPEED_MEDIUM,
  TRANSACTION_SPEED_FAST
} from './constants'
import messages from './messages'

const ClippedText = withEllipsis(Text)

class ChannelCreateSummary extends React.Component {
  static propTypes = {
    amount: PropTypes.number,
    fee: PropTypes.number.isRequired,
    speed: PropTypes.oneOf([
      TRANSACTION_SPEED_SLOW,
      TRANSACTION_SPEED_MEDIUM,
      TRANSACTION_SPEED_FAST
    ]),
    nodePubkey: PropTypes.string.isRequired,
    nodeDisplayName: PropTypes.string
  }

  render() {
    const { amount, fee, speed, nodePubkey, nodeDisplayName, ...rest } = this.props
    const speedTitleMessageKey = speed.toLowerCase()
    const pubkey = nodePubkey.split('@')[0]

    return (
      <Box {...rest}>
        <Box py={3}>
          <Flex alignItems="center">
            <Box width={5 / 11}>
              <Flex flexWrap="wrap" alignItems="baseline">
                <Text textAlign="left" fontSize={6}>
                  <CryptoValue value={amount} />
                </Text>
                <CryptoSelector ml={2} />
              </Flex>
              <Text color="gray">
                {'≈ '}
                <FiatValue style="currency" value={amount} />
              </Text>
            </Box>
            <Flex justifyContent="center" width={1 / 11} color="lightningOrange">
              <BigArrowRight width="40px" height="28px" />
            </Flex>
            <Flex
              flexDirection="column"
              width={5 / 11}
              className="hint--bottom-left"
              data-hint={nodePubkey}
              ml={3}
            >
              {nodeDisplayName && (
                <ClippedText textAlign="right" fontSize="xl">
                  {nodeDisplayName}
                </ClippedText>
              )}
              {nodePubkey && (
                <Text textAlign="right" color={nodeDisplayName ? 'gray' : null}>
                  <Truncate text={pubkey} maxlen={25} />
                </Text>
              )}
            </Flex>
          </Flex>
        </Box>

        {fee > 0 && (
          <>
            <Bar variant="light" />

            <DataRow
              left={<FormattedMessage {...messages.fee} />}
              right={
                <Flex flexDirection="column" alignItems="flex-end">
                  <Flex alignItems="center">
                    <CryptoValue value={fee} />
                    <CryptoSelector ml={2} justify="right" />
                  </Flex>
                  <Text color="gray">
                    <FormattedMessage {...messages[speedTitleMessageKey]} />
                  </Text>
                </Flex>
              }
            />

            <Bar variant="light" />

            <DataRow
              left={<FormattedMessage {...messages.total} />}
              right={
                <>
                  <CryptoValue value={amount + fee} />
                  <CryptoSelector ml={2} justify="right" />
                </>
              }
            />
          </>
        )}
      </Box>
    )
  }
}

export default ChannelCreateSummary
