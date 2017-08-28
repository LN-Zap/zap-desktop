import React from 'react'
import PropTypes from 'prop-types'
import { FaBitcoin } from 'react-icons/lib/fa'
import Isvg from 'react-inlinesvg'

const CryptoIcon = ({ currency }) => {
  switch(currency) {
    case 'btc':
      return (<FaBitcoin />)
      break
    case 'ltc':
      return (
        <Isvg src='/Users/jmow/Projects/bolt/bolt-desktop/resources/litecoin.svg'></Isvg>
      )
      break
    default:
      return <span></span>
  }
}

export default CryptoIcon