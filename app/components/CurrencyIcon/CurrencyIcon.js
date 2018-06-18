import React from 'react'
import PropTypes from 'prop-types'
import { FaDollar } from 'react-icons/lib/fa'
import CryptoIcon from '../CryptoIcon'

const CurrencyIcon = ({ currency, crypto, styles }) =>
  currency === 'usd' ? <FaDollar style={styles} /> : <CryptoIcon styles={styles} currency={crypto} />

CurrencyIcon.propTypes = {
  currency: PropTypes.string.isRequired,
  crypto: PropTypes.string.isRequired,
  styles: PropTypes.object,
}

export default CurrencyIcon
