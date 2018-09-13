import React from 'react'
import PropTypes from 'prop-types'
import { FaDollarSign } from 'react-icons/fa'
import CryptoIcon from '../CryptoIcon'

const CurrencyIcon = ({ currency, crypto, styles }) => {
  return currency === 'usd' ? (
    <FaDollarSign style={styles} />
  ) : (
    <CryptoIcon styles={styles} currency={crypto} />
  )
}

CurrencyIcon.propTypes = {
  currency: PropTypes.string.isRequired,
  crypto: PropTypes.string.isRequired,
  styles: PropTypes.object
}

export default CurrencyIcon
