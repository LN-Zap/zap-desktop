import React from 'react'
import PropTypes from 'prop-types'
import path from 'path'
import { FaBitcoin } from 'react-icons/lib/fa'
import Isvg from 'react-inlinesvg'

const CryptoIcon = ({ currency, styles }) => {
  switch (currency) {
    case 'btc':
      return <FaBitcoin style={styles} />
    case 'ltc':
      return <Isvg style={styles} src={path.join(__dirname, '..', 'resources/litecoin.svg')} />
    default:
      return <span />
  }
}

CryptoIcon.propTypes = {
  currency: PropTypes.string.isRequired
}

export default CryptoIcon
