import React from 'react'
import PropTypes from 'prop-types'

import styled from 'styled-components'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { Flex } from 'rebass'

import { CryptoValue, CryptoSelector, FiatValue } from 'containers/UI'
import { Bar, DataRow, Range, Text, Toggle } from 'components/UI'
import { Truncate } from 'components/Util'
import messages from './messages'
import AutopayStatus from './AutopayStatus'

const SettingsContainer = styled.div`
  position: relative;
  left: -50%;
`

const AutopayCreateSettings = ({
  min,
  max,
  intl,
  limit,
  defaultValue,
  merchantName,
  pubkey,
  isEditMode,
}) => (
  <SettingsContainer>
    {isEditMode && (
      <>
        <DataRow
          left={intl.formatMessage({ ...messages.autopay_status })}
          right={
            <Flex>
              <Toggle field="isEnabled" id="isEnabled" initialValue />
              <AutopayStatus ml={2} />
            </Flex>
          }
        />
        <Bar variant="light" />
      </>
    )}

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
            <CryptoValue fontSize="xxl" value={limit || defaultValue} />
            <CryptoSelector ml={2} />
          </Flex>
          <Flex alignItems="baseline">
            <Text color="gray">=</Text>
            <FiatValue color="gray" style="currency" value={limit || defaultValue} />
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
  isEditMode: PropTypes.bool.isRequired,
  limit: PropTypes.string,
  max: PropTypes.string.isRequired,
  merchantName: PropTypes.string.isRequired,
  min: PropTypes.string.isRequired,
  pubkey: PropTypes.string.isRequired,
}

export default injectIntl(AutopayCreateSettings)
