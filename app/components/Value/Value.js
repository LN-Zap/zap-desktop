import React from 'react'
import PropTypes from 'prop-types'
import { btc } from 'utils'

const Value = ({ value, currency, currentTicker }) => (<i>{btc.convert('sats', currency, value, currentTicker.price_usd)}</i>)

Value.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  currency: PropTypes.string.isRequired,
  currentTicker: PropTypes.object.isRequired
}

export default Value
