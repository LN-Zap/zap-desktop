import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { Flex } from 'rebass'

import { CryptoValue, CryptoSelector, FiatValue } from 'containers/UI'
import { Bar, DataRow, Range, Text } from 'components/UI'
import { Truncate } from 'components/Util'
import messages from './messages'

const SettingsContainer = styled.div`
  position: relative;
  left: -50%;
`

const AutopayCreateSettings = ({ min, max, intl, defaultValue, limit, merchantName, pubkey }) => (
  <SettingsContainer>
    <DataRow
      left={
        <>
          <Flex justifyContent="space-between">
            <Text fontWeight="normal">Limit</Text>
            <Text color="gray" fontWeight="light">
              <FormattedMessage {...messages.max_text} /> <FiatValue style="currency" value={max} />
            </Text>
          </Flex>
          <Range
            field="limit"
            initialValue={defaultValue}
            max={max}
            min={min}
            sliderWidthNumber={240}
          />
        </>
      }
      right={
        <Flex alignItems="flex-end" flexDirection="column" ml={4}>
          <Flex alignItems="baseline">
            <CryptoValue fontSize="xxl" value={limit} />
            <CryptoSelector ml={2} />
          </Flex>
          <Flex alignItems="baseline">
            <Text color="gray">=</Text>
            <FiatValue color="gray" style="currency" value={limit} />
          </Flex>
        </Flex>
      }
    />
    <Bar variant="light" />
    <DataRow left={intl.formatMessage({ ...messages.merchant_name })} right={merchantName} />
    <Bar variant="light" />
    <DataRow
      left={intl.formatMessage({ ...messages.remote_pubkey })}
      right={<Truncate maxlen={40} text={pubkey} />}
    />
    <Bar variant="light" />
  </SettingsContainer>
)

AutopayCreateSettings.propTypes = {
  defaultValue: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
  limit: PropTypes.string.isRequired,
  max: PropTypes.string.isRequired,
  merchantName: PropTypes.string.isRequired,
  min: PropTypes.string.isRequired,
  pubkey: PropTypes.string.isRequired,
}

export default injectIntl(AutopayCreateSettings)
