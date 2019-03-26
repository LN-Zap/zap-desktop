import React from 'react'
import PropTypes from 'prop-types'
import { FormattedNumber } from 'react-intl'
import { convert } from '@zap/utils/btc'

const forcePositiveNumber = amount => (amount >= 0 ? amount * 1 : amount * -1)

/**
 * Renders a satoshi amount into a specific currency/unit.
 * @param {[type]} value         Amount in satoshis.
 * @param {[type]} currency      Currency to display as (btc, bits, sats, msats, fiat).
 * @param {[type]} currentTicker Current fiat ticker info.
 * @param {[type]} fiatTicker    Key of fiat ticker to use for fiat conversions.
 */
const Value = ({ value, currency, currentTicker, fiatTicker, style }) => {
  let price
  if (currency === 'fiat') {
    price = currentTicker[fiatTicker]
  }

  // Convert the satoshi amount to the requested currency
  const convertedAmount = convert('sats', currency, forcePositiveNumber(value), price)

  // Truncate the amount to the most relevant number of decimal places:
  let dp = 11
  switch (currency) {
    case 'btc':
    case 'ltc':
      dp = 8
      break
    case 'bits':
    case 'phots':
      dp = 5
      break
    case 'sats':
    case 'lits':
      dp = 3
      break
    case 'msats':
    case 'mlits':
      dp = 0
      break
    case 'fiat':
      dp = 2
      break
  }

  const truncatedAmount = convertedAmount.toFixed(dp)

  // Convert to a string and remove all trailing zeros.
  const trimmedAmount = String(truncatedAmount).replace(/\.?0+$/, '')
  return (
    <FormattedNumber
      currency={fiatTicker}
      maximumFractionDigits={dp}
      style={style}
      value={trimmedAmount}
    />
  )
}

Value.propTypes = {
  currency: PropTypes.string.isRequired,
  currentTicker: PropTypes.object,
  fiatTicker: PropTypes.string,
  style: PropTypes.oneOf(['decimal', 'currency']),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

Value.defaultProps = {
  style: 'decimal',
}

export default Value
