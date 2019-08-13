import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass'
import { FormattedMessage } from 'react-intl'
import BigArrowRight from 'components/Icon/BigArrowRight'
import { Bar, DataRow, Text } from 'components/UI'
import { TransactionSpeedDesc } from 'components/Form'
import { CryptoValueSelector, FiatValue } from 'containers/UI'
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
    lndTargetConfirmations: PropTypes.object.isRequired,
    nodeDisplayName: PropTypes.string,
    nodePubkey: PropTypes.string.isRequired,
    speed: PropTypes.oneOf([
      TRANSACTION_SPEED_SLOW,
      TRANSACTION_SPEED_MEDIUM,
      TRANSACTION_SPEED_FAST,
    ]),
  }

  render() {
    const {
      amount,
      fee,
      speed,
      nodePubkey,
      nodeDisplayName,
      lndTargetConfirmations,
      ...rest
    } = this.props
    const [pubkey] = nodePubkey.split('@')

    return (
      <Box {...rest}>
        <Box py={3}>
          <Flex alignItems="center">
            <Box width={5 / 11}>
              <CryptoValueSelector fontSize="xxl" value={amount} />
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
                <>
                  <Flex>
                    <CryptoValueSelector mr={2} value={fee} />
                    <Text>
                      <FormattedMessage {...messages.fee_per_byte} />
                    </Text>
                  </Flex>

                  <TransactionSpeedDesc
                    fontSize="s"
                    lndTargetConfirmations={lndTargetConfirmations}
                    speed={speed}
                  />
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
