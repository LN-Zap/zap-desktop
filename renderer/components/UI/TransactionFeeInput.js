import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Box, Flex } from 'rebass'
import { withFormApi } from 'informed'
import Radio from 'components/UI/Radio'
import RadioGroup from 'components/UI/RadioGroup'
import Spinner from 'components/UI/Spinner'
import Text from 'components/UI/Text'
import CryptoValue from 'containers/UI/CryptoValue'
import CryptoSelector from 'containers/UI/CryptoSelector'

import messages from './messages'
import {
  TRANSACTION_SPEED_SLOW,
  TRANSACTION_SPEED_MEDIUM,
  TRANSACTION_SPEED_FAST,
} from './constants'

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
  isQueryingFees,
  initialValue,
  label,
  field,
  formApi,
  fee,
}) => {
  const value = formApi.getValue(field)
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
              &hellip;
            </Text>
            <Spinner color="lightningOrange" />
          </Flex>
        )}

        {!isQueryingFees && !Number.isFinite(fee) && <FormattedMessage {...messages.fee_unknown} />}

        {!isQueryingFees && Number.isFinite(fee) && value && (
          <Flex alignItems="flex-end" flexDirection="column">
            <Box>
              <CryptoValue value={fee} />
              <CryptoSelector mx={2} />
              <FormattedMessage {...messages.fee_per_byte} />
            </Box>
            <TransactionSpeedDesc
              color="gray"
              lndTargetConfirmations={lndTargetConfirmations}
              speed={value}
            />
          </Flex>
        )}
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
  fee: PropTypes.number,
  field: PropTypes.string.isRequired,
  formApi: PropTypes.object.isRequired,
  initialValue: PropTypes.string,
  isQueryingFees: PropTypes.bool,
  label: PropTypes.string,
  lndTargetConfirmations: PropTypes.shape({
    fast: PropTypes.number.isRequired,
    medium: PropTypes.number.isRequired,
    slow: PropTypes.number.isRequired,
  }).isRequired,
}

TransactionFeeInput.defaultProps = {
  initialValue: TRANSACTION_SPEED_SLOW,
}

export default withFormApi(TransactionFeeInput)
