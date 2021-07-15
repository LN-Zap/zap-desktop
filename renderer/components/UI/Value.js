import React from 'react'

import PropTypes from 'prop-types'
import { FormattedNumber } from 'react-intl'

import { convert } from '@zap/utils/btc'
import { CoinBig } from '@zap/utils/coin'

/**
 * Value - Renders a satoshi amount into a specific currency/unit.
 *
 * @param {object} options Options
 * @param {number} options.value Amount in satoshis.
 * @param {string} options.currency Currency to display as (btc, bits, sats, msats, fiat).
 * @param {object} options.currentTicker Current fiat ticker info.
 * @param {object} options.fiatTicker Key of fiat ticker to use for fiat conversions.
 * @param {string} options.style Display style
 * @returns {object} Component
 */
const Value = ({ value, currency, currentTicker, fiatTicker, style }) => {
  const price = currency === 'fiat' ? currentTicker[fiatTicker] : null

  // Convert the satoshi amount to the requested currency.
  const convertedAmount = convert('sats', currency, value, price)

  const absAmount = CoinBig(convertedAmount)
    .abs()
    .toString()

  // Truncate the amount to the most relevant number of decimal places.
  let dp
  switch (currency) {
    case 'btc':
      dp = 11
      break
    case 'bits':
      dp = 5
      break
    case 'sats':
      dp = 3
      break
    case 'msats':
      dp = 0
      break
    case 'fiat':
      dp = 2
      break
    default:
      dp = 11
  }

  return (
    <FormattedNumber
      currency={fiatTicker}
      maximumFractionDigits={dp}
      style={style}
      value={absAmount}
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
