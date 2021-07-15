import React from 'react'

import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Box, Flex } from 'rebass/styled-components'

import { CoinBig } from '@zap/utils/coin'
import { TransactionSpeedDesc } from 'components/Form'
import BigArrowRight from 'components/Icon/BigArrowRight'
import { Bar, DataRow, Text } from 'components/UI'
import { Truncate } from 'components/Util'
import { CryptoValueSelector, FiatValue } from 'containers/UI'
import { withEllipsis } from 'hocs'

import {
  TRANSACTION_SPEED_SLOW,
  TRANSACTION_SPEED_MEDIUM,
  TRANSACTION_SPEED_FAST,
} from './constants'
import messages from './messages'

const ClippedText = withEllipsis(Text)

const ChannelCreateSummary = ({
  amount,
  fee,
  speed,
  nodePubkey,
  nodeDisplayName,
  lndTargetConfirmations,
  ...rest
}) => {
  const [pubkey] = nodePubkey.split('@')

  /* eslint-disable shopify/jsx-no-hardcoded-content */
  const approximateFiatAmount = () => (
    <Text color="gray">
      ≈&nbsp;
      <FiatValue style="currency" value={amount} />
    </Text>
  )
  /* eslint-enable shopify/jsx-no-hardcoded-content */

  return (
    <Box {...rest}>
      <Box py={3}>
        <Flex alignItems="center">
          <Box width={5 / 11}>
            <CryptoValueSelector fontSize="xxl" value={amount} />
            {approximateFiatAmount()}
          </Box>
          <Flex color="primaryAccent" justifyContent="center" width={1 / 11}>
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

      {CoinBig(fee).gt(0) && (
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

ChannelCreateSummary.propTypes = {
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  fee: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  lndTargetConfirmations: PropTypes.object.isRequired,
  nodeDisplayName: PropTypes.string,
  nodePubkey: PropTypes.string.isRequired,
  speed: PropTypes.oneOf([
    TRANSACTION_SPEED_SLOW,
    TRANSACTION_SPEED_MEDIUM,
    TRANSACTION_SPEED_FAST,
  ]),
}

export default ChannelCreateSummary
