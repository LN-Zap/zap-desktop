import React from 'react'
import PropTypes from 'prop-types'
import { FaDollar } from 'react-icons/lib/fa'
import CryptoIcon from '../CryptoIcon'

const CurrencyIcon = ({ currency, crypto }) => (currency === 'usd' ?
  <FaDollar />
  :
  <CryptoIcon currency={crypto} />)

CurrencyIcon.propTypes = {
  currency: PropTypes.string.isRequired,
  crypto: PropTypes.string.isRequired
}

export default CurrencyIcon
