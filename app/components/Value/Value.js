import React from 'react'
import PropTypes from 'prop-types'
import { btc } from 'utils'

const Value = ({ value, currency, currentTicker }) => {
  const renderValue = () => {
    if (currency === 'btc') {
      return btc.satoshisToBtc(value)
    }

    return 'gang'
  }

  return (
    <i>{renderValue()}</i>
  )
}

Value.propTypes = {
  
}

export default Value
