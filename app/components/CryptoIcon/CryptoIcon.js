import React from 'react'
import PropTypes from 'prop-types'
import path from 'path'
import Isvg from 'react-inlinesvg'

const CryptoIcon = ({ currency, styles }) => {
  switch (currency) {
    case 'btc':
      return <Isvg style={styles} src={path.join(__dirname, '..', 'resources/icons/skinny_bitcoin.svg')} />
    case 'ltc':
      return <Isvg style={styles} src={path.join(__dirname, '..', 'resources/litecoin.svg')} />
    default:
      return <span />
  }
}

CryptoIcon.propTypes = {
  currency: PropTypes.string.isRequired,
  styles: PropTypes.object
}

export default CryptoIcon
