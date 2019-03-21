import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Flex } from 'rebass'
import { CryptoValue, CryptoSelector, FiatValue } from 'containers/UI'
import { Bar, DataRow, Range, Text } from 'components/UI'
import { Truncate } from 'components/Util'

const SettingsContainer = styled.div`
  position: relative;
  left: -50%;
`

const AutopayCreateSettings = ({ min, max, defaultValue, limit, merchantName, pubkey }) => (
  <SettingsContainer>
    <DataRow
      left={
        <>
          <Flex justifyContent="space-between">
            <Text fontWeight="normal">Range</Text>
            <Text color="gray" fontWeight="light">
              max. <FiatValue style="currency" value={max} />
            </Text>
          </Flex>
          <Range
            field="limit"
            initialValue={defaultValue}
            max={max}
            min={min}
            sliderWidthNumber={350}
          />
        </>
      }
      right={
        <Flex alignItems="flex-end" flexDirection="column">
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
    <DataRow left="Name" right={merchantName} />
    <Bar variant="light" />
    <DataRow left="Remote PubKey" right={<Truncate maxlen={40} text={pubkey} />} />
    <Bar variant="light" />
  </SettingsContainer>
)

AutopayCreateSettings.propTypes = {
  defaultValue: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  merchantName: PropTypes.string.isRequired,
  min: PropTypes.number.isRequired,
  pubkey: PropTypes.string.isRequired,
}

export default AutopayCreateSettings
