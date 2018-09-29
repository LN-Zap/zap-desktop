import React from 'react'
import PropTypes from 'prop-types'
import { btc } from 'lib/utils'

const Value = ({ value, currency, currentTicker, fiatTicker }) => {
  if (currency === 'sats') {
    return <i>{value > 0 ? value : value * -1}</i>
  }

  return <i>{btc.convert('sats', currency, value, currentTicker[fiatTicker])}</i>
}

Value.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  currency: PropTypes.string.isRequired,
  currentTicker: PropTypes.object.isRequired,
  fiatTicker: PropTypes.string.isRequired
}

export default Value
