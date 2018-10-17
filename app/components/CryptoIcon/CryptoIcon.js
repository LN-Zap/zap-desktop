import React from 'react'
import PropTypes from 'prop-types'

import SkinnyBitcoin from 'components/Icon/SkinnyBitcoin'
import Litecoin from 'components/Icon/Litecoin'

const CryptoIcon = ({ currency, styles }) => {
  switch (currency) {
    case 'btc':
      return <SkinnyBitcoin style={styles} />
    case 'ltc':
      return <Litecoin style={styles} />
    default:
      return <span />
  }
}

CryptoIcon.propTypes = {
  currency: PropTypes.string.isRequired,
  styles: PropTypes.object
}

export default CryptoIcon
