import { shell } from 'electron'
import React from 'react'
import PropTypes from 'prop-types'
import AnimatedCheckmark from 'components/AnimatedCheckmark'
import { btc } from 'utils'
import styles from './SuccessfulSendCoins.scss'

const SuccessfulSendCoins = ({ amount, addr, txid, hideModal, currentTicker, currency }) => {
  const calculatedAmount = currency === 'usd' ? btc.satoshisToUsd(amount, currentTicker.price_usd) : btc.satoshisToBtc(amount)

  return (
    <div className={styles.container}>
      <AnimatedCheckmark />
      <h1>
        You&nbsp;
        <span className={styles.link} onClick={() => shell.openExternal(`https://testnet.smartbit.com.au/tx/${txid}`)}>sent</span>&nbsp;
        <span className={styles.amount}>{calculatedAmount} {currency.toUpperCase()}</span>&nbsp;
        to&nbsp;
        <span className={styles.addr}>{addr}</span>
      </h1>
      <div className={styles.button} onClick={hideModal}>
        Done
      </div>
    </div>
  )
}

SuccessfulSendCoins.propTypes = {
  amount: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]).isRequired,
  addr: PropTypes.string.isRequired,
  txid: PropTypes.string.isRequired,
  hideModal: PropTypes.func.isRequired,
  currentTicker: PropTypes.object.isRequired,
  currency: PropTypes.string.isRequired
}

export default SuccessfulSendCoins
