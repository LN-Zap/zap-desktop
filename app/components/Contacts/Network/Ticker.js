import React from 'react'
import PropTypes from 'prop-types'
import { Text, Value } from 'components/UI'

const Ticker = ({ size, currencyName, channelBalance, currentTicker, currency, fiatTicker }) => (
  <Text fontSize={size}>
    <Value
      value={channelBalance || 0}
      currency={currency}
      currentTicker={currentTicker}
      fiatTicker={fiatTicker}
    />
    <i> {currencyName}</i>
  </Text>
)

Ticker.propTypes = {
  size: PropTypes.string,
  currencyName: PropTypes.string.isRequired,
  channelBalance: PropTypes.number.isRequired,
  currentTicker: PropTypes.object.isRequired,
  currency: PropTypes.string.isRequired,
  fiatTicker: PropTypes.string.isRequired
}

export default Ticker
