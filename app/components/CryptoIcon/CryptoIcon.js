import React from 'react'
import PropTypes from 'prop-types'
import { FaBitcoin } from 'react-icons/lib/fa'
// import Litecoin from '../resources/'

const CryptoIcon = ({ currency }) => {
  switch(currency) {
    case 'btc':
      return (<FaBitcoin />)
      break
    case 'ltc':
      return <span>LTC</span>
      break
    default:
      return <span></span>
  }
}