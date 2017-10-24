import React from 'react'
import PropTypes from 'prop-types'
import copy from 'copy-to-clipboard'
import { showNotification } from 'notifications'
import CryptoIcon from 'components/CryptoIcon'
import { btc, usd } from 'utils'
import styles from './Wallet.scss'

const Wallet = ({ ticker, currentTicker, balance, address, pubkey, showModal }) => {
  const copyOnClick = data => {
    copy(data)
    showNotification('Noice', 'Successfully copied to clipboard')
  }

  return (
    <div className={styles.wallet} onClick={() => showModal('WALLET_DETAILS', {})}>
      <div className={styles.content}>
        <div className={styles.left}>
          <div className={styles.leftContent}>
            <CryptoIcon currency={ticker.crypto} />
            <div className={styles.details}>
              <h1>{btc.satoshisToBtc(parseFloat(balance.walletBalance) + parseFloat(balance.channelBalance))} BTC</h1>
              <span>{btc.satoshisToBtc(balance.walletBalance)} available</span>
              <span>{btc.satoshisToBtc(balance.channelBalance)} in channels</span>
            </div>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.rightContent}>
            <div className={styles.data}>
              <h2>Node public key (<span onClick={() => copyOnClick(pubkey)}>copy</span>)</h2>
              <p>{pubkey}</p>
            </div>
            <div className={styles.data}>
              <h2>Deposit address (<span onClick={() => copyOnClick(address)}>copy</span>)</h2>
              <p>{address}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Wallet.propTypes = {
  ticker: PropTypes.object.isRequired,
  currentTicker: PropTypes.object.isRequired,
  balance: PropTypes.object.isRequired,
  address: PropTypes.string.isRequired,
  pubkey: PropTypes.string.isRequired,
  showModal: PropTypes.func.isRequired
}

export default Wallet