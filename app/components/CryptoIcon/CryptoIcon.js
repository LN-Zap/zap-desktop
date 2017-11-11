import React from 'react'
import PropTypes from 'prop-types'
import path from 'path'
import Isvg from 'react-inlinesvg'

import skinnyBitcoinIcon from 'icons/skinny_bitcoin.svg'
import litecoinIcon from 'icons/skinny_bitcoin.svg'

const CryptoIcon = ({ currency, styles }) => {
  switch (currency) {
    case 'btc':
      return <Isvg style={styles} src={skinnyBitcoinIcon} />
    case 'ltc':
      return <Isvg style={styles} src={litecoinIcon} />
    default:
      return <span />
  }
}

CryptoIcon.propTypes = {
  currency: PropTypes.string.isRequired,
  styles: PropTypes.object
}

export default CryptoIcon
