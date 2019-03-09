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

function TransactionFeeInput({ isQueryingFees, label, field, formApi, fee }) {
  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Box>
        <RadioGroup field={field} label={label} required>
          <Flex>
            {speeds.map(speed => (
              <Radio
                key={speed}
                label={<FormattedMessage {...messages[speed.toLowerCase()]} />}
                mb={0}
                mr={4}
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

        {!isQueryingFees && !fee && <FormattedMessage {...messages.fee_unknown} />}

        {!isQueryingFees && fee && (
          <Flex alignItems="flex-end" flexDirection="column">
            <Box>
              <CryptoValue value={fee} />
              <CryptoSelector mx={2} />
              <FormattedMessage {...messages.fee_per_byte} />
            </Box>
            <Text color="gray">
              <FormattedMessage
                {...messages[formApi.getValue(field).toLowerCase() + '_description']}
              />
            </Text>
          </Flex>
        )}
      </Box>
    </Flex>
  )
}

TransactionFeeInput.propTypes = {
  fee: PropTypes.number,
  field: PropTypes.string.isRequired,
  formApi: PropTypes.object.isRequired,
  isQueryingFees: PropTypes.bool,
  label: PropTypes.string,
}

export default withFormApi(TransactionFeeInput)
