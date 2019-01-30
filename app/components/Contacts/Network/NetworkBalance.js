import React from 'react'
import PropTypes from 'prop-types'
import { Box } from 'rebass'
import { Text } from 'components/UI'
import { CryptoValue, FiatValue } from 'containers/UI'

const NetworkBalance = ({ currencyName, channelBalance }) => (
  <Box mx={3}>
    <CryptoValue value={channelBalance} /> {currencyName}
    <Text color="gray">
      {' ≈ '}
      <FiatValue value={channelBalance} style="currency" />
    </Text>
  </Box>
)

NetworkBalance.propTypes = {
  currencyName: PropTypes.string.isRequired,
  channelBalance: PropTypes.number.isRequired
}

export default NetworkBalance
