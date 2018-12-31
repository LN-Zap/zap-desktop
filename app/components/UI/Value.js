import React from 'react'
import PropTypes from 'prop-types'
import { convert } from 'lib/utils/btc'

const Value = ({ value, currency, currentTicker, fiatTicker }) => {
  if (currency === 'sats') {
    return <i>{value > 0 ? value : value * -1}</i>
  }
  let price
  if (currency === 'fiat') {
    price = currentTicker[fiatTicker]
  }
  return (
    <i>
      {Number(convert('sats', currency, value, price))
        .toFixed(8)
        .replace(/\.?0+$/, '')}
    </i>
  )
}

Value.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  currency: PropTypes.string.isRequired,
  currentTicker: PropTypes.object,
  fiatTicker: PropTypes.string
}

export default Value
