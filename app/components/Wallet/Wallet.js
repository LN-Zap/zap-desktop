import React from 'react'
import PropTypes from 'prop-types'
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from 'react-icons/md'
import Isvg from 'react-inlinesvg'

import { btc, blockExplorer } from 'lib/utils'
import Value from 'components/Value'
import AnimatedCheckmark from 'components/AnimatedCheckmark'
import Settings from 'components/Settings'

import zapLogo from 'icons/zap_logo.svg'
import qrCode from 'icons/qrcode.svg'

import styles from './Wallet.scss'

const Wallet = ({
  balance,
  info,
  openReceiveModal,
  ticker,
  currentTicker,
  openPayForm,
  openRequestForm,
  showPayLoadingScreen,
  showSuccessPayScreen,
  successTransactionScreen,
  currentCurrencyFilters,
  currencyName,
  setCurrency,
  setWalletCurrencyFilters,
  network,
  settingsProps,
  paymentTimeout
}) => {
  const fiatAmount = btc.satoshisToFiat(
    parseInt(balance.walletBalance, 10) + parseInt(balance.channelBalance, 10),
    currentTicker[ticker.fiatTicker].last
  )

  const onCurrencyFilterClick = currency => {
    setCurrency(currency)
    setWalletCurrencyFilters(false)
  }

  return (
    <div className={styles.wallet}>
      <div className={styles.content}>
        <header className={styles.header}>
          <section className={styles.logo}>
            <Isvg className={styles.bitcoinLogo} src={zapLogo} />
            {info.data.testnet && <span className={styles.testnetPill}>Testnet</span>}
          </section>

          <section className={styles.user}>
            <div
              className={`${styles.alias} ${settingsProps.settings.settingsOpen &&
                styles.settingsOpen}`}
              onClick={settingsProps.toggleSettings}
            >
              <span className={styles.aliasText}>{info.data.alias}</span>
              {settingsProps.settings.settingsOpen ? (
                <MdKeyboardArrowUp />
              ) : (
                <MdKeyboardArrowDown />
              )}
            </div>
            {settingsProps.settings.settingsOpen && <Settings {...settingsProps} />}
          </section>
        </header>

        <div className={styles.left}>
          <div className={styles.leftContent}>
            <span onClick={openReceiveModal} className={styles.qrCode}>
              <Isvg className={styles.bitcoinLogo} src={qrCode} />
            </span>
            <div className={styles.details}>
              <h1>
                <span>
                  <Value
                    value={parseFloat(balance.walletBalance) + parseFloat(balance.channelBalance)}
                    currency={ticker.currency}
                    currentTicker={currentTicker}
                    fiatTicker={ticker.fiatTicker}
                  />
                  <section className={styles.currencyContainer}>
                    <i className={styles.currency}>{currencyName}</i>
                    <span onClick={() => setWalletCurrencyFilters(!info.showWalletCurrencyFilters)}>
                      <MdKeyboardArrowDown />
                    </span>

                    <ul className={info.showWalletCurrencyFilters ? styles.active : undefined}>
                      {currentCurrencyFilters.map(filter => (
                        <li key={filter.key} onClick={() => onCurrencyFilterClick(filter.key)}>
                          {filter.name}
                        </li>
                      ))}
                    </ul>
                  </section>
                </span>
              </h1>
              <span className={styles.usdValue}>
                ≈ {currentTicker[ticker.fiatTicker].symbol}
                {fiatAmount ? fiatAmount.toLocaleString() : ''}
              </span>
            </div>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.rightContent}>
            <div className={styles.pay} onClick={openPayForm}>
              Pay
            </div>
            <div className={styles.request} onClick={openRequestForm}>
              Request
            </div>
          </div>
          <div className={styles.notificationBox}>
            {showPayLoadingScreen && (
              <span>
                <div className={styles.spinnerContainer}>
                  <section className={`${styles.spinner} ${styles.icon}`} />
                  <span className={styles.timeout}>{paymentTimeout / 1000}</span>
                </div>
                <section>Sending your transaction</section>
              </span>
            )}
            {showSuccessPayScreen && (
              <span>
                <section className={styles.icon}>
                  <AnimatedCheckmark />
                </section>
                <section>Successfully sent payment</section>
              </span>
            )}
            {successTransactionScreen.show && (
              <span>
                <section className={styles.icon}>
                  <AnimatedCheckmark />
                </section>
                <section>
                  Successfully{' '}
                  <span
                    className={styles.txLink}
                    onClick={() => {
                      return blockExplorer.showTransaction(network, successTransactionScreen.txid)
                    }}
                  >
                    sent
                  </span>{' '}
                  transaction
                </section>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

Wallet.propTypes = {
  balance: PropTypes.object.isRequired,
  info: PropTypes.object.isRequired,
  ticker: PropTypes.object.isRequired,
  currentTicker: PropTypes.object.isRequired,
  openPayForm: PropTypes.func.isRequired,
  openRequestForm: PropTypes.func.isRequired,
  openReceiveModal: PropTypes.func.isRequired,
  showPayLoadingScreen: PropTypes.bool.isRequired,
  showSuccessPayScreen: PropTypes.bool.isRequired,
  network: PropTypes.object.isRequired,
  successTransactionScreen: PropTypes.object.isRequired,
  settingsProps: PropTypes.object.isRequired,
  currentCurrencyFilters: PropTypes.array.isRequired,
  currencyName: PropTypes.string.isRequired,
  paymentTimeout: PropTypes.number.isRequired,
  setCurrency: PropTypes.func.isRequired,
  setWalletCurrencyFilters: PropTypes.func.isRequired
}

export default Wallet
