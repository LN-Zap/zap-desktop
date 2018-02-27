import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FaAngleDown } from 'react-icons/lib/fa'
import Isvg from 'react-inlinesvg'

import { btc } from 'utils'
import Value from 'components/Value'

import bitcoinIcon from 'icons/bitcoin.svg'
import zapLogo from 'icons/zap_logo.svg'
import qrCode from 'icons/qrcode.svg'

import styles from './Wallet.scss'

const Wallet = ({
  balance,
  address,
  info,
  newAddress,
  openReceiveModal,
  ticker,
  currentTicker,
  openPayForm,
  openRequestForm,
  showPayLoadingScreen 
}) => {
  const usdAmount = btc.satoshisToUsd((parseInt(balance.walletBalance, 10) + parseInt(balance.channelBalance, 10)), currentTicker.price_usd)
  
  return (
    <div className={styles.wallet}>
      <div className={styles.content}>
        <header className={styles.header}>
          <section className={styles.logo}>
            <Isvg className={styles.bitcoinLogo} src={zapLogo} />
          </section>

          <section className={styles.user}>
            <div>
              <span>{info.data.alias}</span>
              <FaAngleDown />
            </div>
          </section>
        </header>

        <div className={styles.left}>
          <div className={styles.leftContent}>
            <Isvg className={styles.bitcoinLogo} src={bitcoinIcon} />
            <div className={styles.details}>
              <h1>
                <span>
                  <Value
                    value={parseFloat(balance.walletBalance) + parseFloat(balance.channelBalance)}
                    currency={ticker.currency}
                    currentTicker={currentTicker}
                  />
                  <i className={styles.currency}>{btc.renderCurrency(ticker.currency)}</i>
                </span>
                <span onClick={openReceiveModal}>
                  <Isvg className={styles.bitcoinLogo} src={qrCode} />
                </span>
              </h1>
              <span className={styles.usdValue}>≈ ${usdAmount ? usdAmount.toLocaleString() : ''}</span>
            </div>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.rightContent}>
            <div className={styles.pay} onClick={openPayForm}>Pay</div>
            <div className={styles.request} onClick={openRequestForm}>Request</div>
          </div>
          <div className={styles.notificationBox}>
            <section className={styles.spinner} />
            <section>Gang gang gang baby</section>
          </div>
        </div>
      </div>
    </div>
  )
}

Wallet.propTypes = {
  balance: PropTypes.object.isRequired,
  address: PropTypes.string.isRequired,
  info: PropTypes.object.isRequired,
  newAddress: PropTypes.func.isRequired,
  ticker: PropTypes.object.isRequired,
  currentTicker: PropTypes.object.isRequired,
  openPayForm: PropTypes.func.isRequired,
  openRequestForm: PropTypes.func.isRequired
}

export default Wallet
