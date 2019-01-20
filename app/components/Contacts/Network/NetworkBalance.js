import React from 'react'
import PropTypes from 'prop-types'
import { Box } from 'rebass'
import { FormattedNumber } from 'react-intl'
import { Text } from 'components/UI'
import { Ticker } from '.'

const NetworkBalance = ({
  currencyName,
  channelBalance,
  currentTicker,
  currency,
  fiatTicker,
  fiatAmount
}) => (
  <Box mx={3}>
    <Ticker
      currencyName={currencyName}
      channelBalance={channelBalance}
      currentTicker={currentTicker}
      currency={currency}
      fiatTicker={fiatTicker}
    />
    <Text color="gray">
      {' ≈ '}
      <FormattedNumber currency={fiatTicker} style="currency" value={fiatAmount} />
    </Text>
  </Box>
)

NetworkBalance.propTypes = {
  currentTicker: PropTypes.object.isRequired,
  currency: PropTypes.string.isRequired,
  fiatTicker: PropTypes.string.isRequired,
  currencyName: PropTypes.string.isRequired,
  channelBalance: PropTypes.number.isRequired,
  fiatAmount: PropTypes.number.isRequired
}

export default NetworkBalance
