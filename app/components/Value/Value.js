import React from 'react'
import PropTypes from 'prop-types'
import { btc } from 'utils'

const Value = ({ value, currency, currentTicker }) => {
  const renderValue = () => {
    switch (currency) {
      case 'btc':
        return btc.satoshisToBtc(value)
      case 'bits':
        return btc.satoshisToBits(value)
      case 'sats':
        return value
      case 'usd':
        return btc.satoshisToUsd(value, currentTicker.price_usd) 
      default: 
        return value
    }
  }

  return (
    <i>{renderValue()}</i>
  )
}

Value.propTypes = {
  
}

export default Value
