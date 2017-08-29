import React from 'react'
import PropTypes from 'prop-types'
import path from 'path'
import { FaBitcoin } from 'react-icons/lib/fa'
import Isvg from 'react-inlinesvg'

const CryptoIcon = ({ currency }) => {
  switch(currency) {
    case 'btc':
      return <FaBitcoin />
      break
    case 'ltc':
      return <Isvg src={path.join(__dirname, '..', 'resources/litecoin.svg')}></Isvg>
      break
    default:
      return <span></span>
  }
}

export default CryptoIcon