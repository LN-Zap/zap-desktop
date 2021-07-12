import React from 'react'

import { useFieldState } from 'informed'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Box, Flex } from 'rebass/styled-components'

import { CoinBig } from '@zap/utils/coin'
import { Spinner, Text } from 'components/UI'
import CryptoSelector from 'containers/UI/CryptoSelector'
import CryptoValue from 'containers/UI/CryptoValue'

import {
  TRANSACTION_SPEED_SLOW,
  TRANSACTION_SPEED_MEDIUM,
  TRANSACTION_SPEED_FAST,
} from './constants'
import messages from './messages'
import Radio from './Radio'
import RadioGroup from './RadioGroup'

const speeds = [TRANSACTION_SPEED_SLOW, TRANSACTION_SPEED_MEDIUM, TRANSACTION_SPEED_FAST]
const speedMessageMap = [
  {
    threshold: 2,
    messageKey: 'transaction_speed_description_fastest',
  },
  {
    threshold: 4,
    messageKey: 'transaction_speed_description_fast',
  },
  {
    threshold: 12,
    messageKey: 'transaction_speed_description_medium',
  },
  {
    threshold: 100,
    messageKey: 'transaction_speed_description_slow',
  },
  {
    threshold: Infinity,
    messageKey: 'transaction_speed_description_slowest',
  },
]

const TransactionFeeInput = ({
  lndTargetConfirmations,
  hasFee = true,
  isQueryingFees = false,
  initialValue = TRANSACTION_SPEED_SLOW,
  label,
  field,
  fee,
}) => {
  const { value } = useFieldState(field)
  const isFeeKnown = CoinBig(fee).isFinite()

  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Box>
        <RadioGroup field={field} initialValue={initialValue} label={label} required>
          <Flex>
            {speeds.map(speed => (
              <Radio
                key={speed}
                label={<FormattedMessage {...messages[speed.toLowerCase()]} />}
                mb={0}
                mr={3}
                value={speed}
              />
            ))}
          </Flex>
        </RadioGroup>
      </Box>
      <Box>
        {isQueryingFees && (
          <Flex alignItems="center" justifyContent="flex-end" ml="auto">
            <Text mr={2}>
              <FormattedMessage {...messages.calculating} />
            </Text>
            <Spinner color="primaryAccent" />
          </Flex>
        )}

        {!isQueryingFees && hasFee && !isFeeKnown && <FormattedMessage {...messages.fee_unknown} />}

        <Flex alignItems="flex-end" flexDirection="column">
          {!isQueryingFees && hasFee && value && (
            <Box>
              <CryptoValue value={fee} />
              <CryptoSelector mx={2} />
              <FormattedMessage {...messages.fee_per_byte} />
            </Box>
          )}
          {value && (
            <TransactionSpeedDesc
              color="gray"
              lndTargetConfirmations={lndTargetConfirmations}
              speed={value}
            />
          )}
        </Flex>
      </Box>
    </Flex>
  )
}

export const TransactionSpeedDesc = ({ lndTargetConfirmations, speed, ...rest }) => {
  const CONF_MAP = {
    [TRANSACTION_SPEED_SLOW]: lndTargetConfirmations.slow,
    [TRANSACTION_SPEED_MEDIUM]: lndTargetConfirmations.medium,
    [TRANSACTION_SPEED_FAST]: lndTargetConfirmations.fast,
  }
  const targetConf = CONF_MAP[speed]
  const speedMessageKey =
    targetConf && speedMessageMap.find(item => targetConf <= item.threshold).messageKey
  return (
    speedMessageKey && (
      <Text {...rest}>
        <FormattedMessage {...messages[speedMessageKey]} />
      </Text>
    )
  )
}

TransactionSpeedDesc.propTypes = {
  lndTargetConfirmations: PropTypes.object.isRequired,
  speed: PropTypes.string.isRequired,
}

TransactionFeeInput.propTypes = {
  fee: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  field: PropTypes.string.isRequired,
  hasFee: PropTypes.bool,
  initialValue: PropTypes.string,
  isQueryingFees: PropTypes.bool,
  label: PropTypes.string,
  lndTargetConfirmations: PropTypes.shape({
    fast: PropTypes.number.isRequired,
    medium: PropTypes.number.isRequired,
    slow: PropTypes.number.isRequired,
  }).isRequired,
}

export default TransactionFeeInput
