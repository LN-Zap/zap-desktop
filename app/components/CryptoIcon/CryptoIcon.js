import React from 'react'
import PropTypes from 'prop-types'
import path from 'path'
import { FaBitcoin } from 'react-icons/lib/fa'
import Isvg from 'react-inlinesvg'

const CryptoIcon = ({ currency }) => {
  switch (currency) {
    case 'btc':
      return <FaBitcoin />
    case 'ltc':
      return <Isvg src={path.join(__dirname, '..', 'resources/litecoin.svg')} />
    default:
      return <span />
  }
}

CryptoIcon.propTypes = {
  currency: PropTypes.string.isRequired
}

export default CryptoIcon
