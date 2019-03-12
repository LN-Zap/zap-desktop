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
  TRANSACTION_SPEED_FAST,
} from './constants'
import messages from './messages'

const ClippedText = withEllipsis(Text)

class ChannelCreateSummary extends React.Component {
  static propTypes = {
    amount: PropTypes.number,
    fee: PropTypes.number.isRequired,
    nodeDisplayName: PropTypes.string,
    nodePubkey: PropTypes.string.isRequired,
    speed: PropTypes.oneOf([
      TRANSACTION_SPEED_SLOW,
      TRANSACTION_SPEED_MEDIUM,
      TRANSACTION_SPEED_FAST,
    ]),
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
              <Flex alignItems="baseline" flexWrap="wrap">
                <Text fontSize="xxl" textAlign="left">
                  <CryptoValue value={amount} />
                </Text>
                <CryptoSelector ml={2} />
              </Flex>
              <Text color="gray">
                {'≈ '}
                <FiatValue style="currency" value={amount} />
              </Text>
            </Box>
            <Flex color="lightningOrange" justifyContent="center" width={1 / 11}>
              <BigArrowRight height="28px" width="40px" />
            </Flex>
            <Flex
              className="hint--bottom-left"
              data-hint={nodePubkey}
              flexDirection="column"
              ml={3}
              width={5 / 11}
            >
              {nodeDisplayName && (
                <ClippedText fontSize="xl" textAlign="right">
                  {nodeDisplayName}
                </ClippedText>
              )}
              {nodePubkey && (
                <Text color={nodeDisplayName ? 'gray' : null} textAlign="right">
                  <Truncate maxlen={25} text={pubkey} />
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
                <Flex alignItems="flex-end" flexDirection="column">
                  <Flex alignItems="center">
                    <CryptoValue value={fee} />
                    <CryptoSelector justify="right" ml={2} />
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
                  <CryptoSelector justify="right" ml={2} />
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
