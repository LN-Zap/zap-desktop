import React from 'react'
import PropTypes from 'prop-types'
import Isvg from 'react-inlinesvg'

import skinnyBitcoinIcon from 'icons/skinny-bitcoin.svg'
import litecoinIcon from 'icons/litecoin.svg'

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
