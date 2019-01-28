import React from 'react'
import PropTypes from 'prop-types'
import { FormattedNumber } from 'react-intl'
import { convert } from 'lib/utils/btc'

const forcePositive = amount => (amount >= 0 ? amount : amount * -1)

/**
 * Renders a satoshi amount into a specific currency/unit.
 * @param {[type]} value         Amount in satoshis.
 * @param {[type]} currency      Currency to display as (btc, bits, sats, msats, fiat).
 * @param {[type]} currentTicker Current fiat ticker info.
 * @param {[type]} fiatTicker    Key of fiat ticker to use for fiat conversions.
 */
const Value = ({ value, currency, currentTicker, fiatTicker }) => {
  let price
  if (currency === 'fiat') {
    price = currentTicker[fiatTicker]
  }

  // Convert the satoshi amount to the requested currency
  const convertedAmount = convert('sats', currency, forcePositive(value), price)

  // Truncate the amount to the most relevant number of decimal places:
  let dp = 11
  switch (currency) {
    case 'btc':
      dp = 8
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
  }

  const truncatedAmount = convertedAmount.toFixed(dp)

  // Convert to a string and remove all trailing zeros.
  const trimmedAmount = String(truncatedAmount).replace(/\.?0+$/, '')
  return <FormattedNumber value={trimmedAmount} />
}

Value.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  currency: PropTypes.string.isRequired,
  currentTicker: PropTypes.object,
  fiatTicker: PropTypes.string
}

export default Value
