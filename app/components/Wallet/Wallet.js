import React from 'react'
import PropTypes from 'prop-types'
import FaAngleUp from 'react-icons/lib/fa/angle-up'
import FaAngleDown from 'react-icons/lib/fa/angle-down'
import Isvg from 'react-inlinesvg'

import { btc, blockExplorer } from 'lib/utils'
import Value from 'components/Value'
import AnimatedCheckmark from 'components/AnimatedCheckmark'
import Settings from 'components/Settings'
import Button from 'components/UI/Button'

import zapLogo from 'icons/zap_logo.svg'
import zapLogoBlack from 'icons/zap_logo_black.svg'
import qrCode from 'icons/qrcode.svg'

import { FormattedNumber, FormattedMessage } from 'react-intl'
import messages from './messages'

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
  paymentTimeout,
  theme
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
    <div className={`${styles.wallet}`}>
      <div className={styles.content}>
        <header className={styles.header}>
          <section className={styles.logo}>
            <Isvg className={styles.bitcoinLogo} src={theme === 'light' ? zapLogoBlack : zapLogo} />
            {info.data.testnet && <span className={styles.testnetPill}>Testnet</span>}
          </section>

          <section className={styles.user}>
            <div
              className={`${styles.alias} ${settingsProps.settings.settingsOpen &&
                styles.settingsOpen}`}
              onClick={settingsProps.toggleSettings}
            >
              <span className={styles.aliasText}>{info.data.alias}</span>
              {settingsProps.settings.settingsOpen ? <FaAngleUp /> : <FaAngleDown />}
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
                      <FaAngleDown />
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
              {Boolean(fiatAmount) && (
                <span>
                  {'≈ '}
                  <FormattedNumber
                    currency={ticker.fiatTicker}
                    style="currency"
                    value={fiatAmount}
                  />
                </span>
              )}
            </div>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.rightContent}>
            <Button onClick={openPayForm} variant="primary" my={10} mx={7.5} width={100}>
              <FormattedMessage {...messages.pay} />
            </Button>
            <Button onClick={openRequestForm} variant="primary" my={10} mx={7.5} width={100}>
              <FormattedMessage {...messages.request} />
            </Button>
          </div>
          <div className={styles.notificationBox}>
            {showPayLoadingScreen && (
              <span>
                <div className={styles.spinnerContainer}>
                  <section className={`${styles.spinner} ${styles.icon}`} />
                  <span className={styles.timeout}>{paymentTimeout / 1000}</span>
                </div>
                <section>
                  <FormattedMessage {...messages.sending_tx} />
                </section>
              </span>
            )}
            {showSuccessPayScreen && (
              <span>
                <section className={styles.icon}>
                  <AnimatedCheckmark />
                </section>
                <section>
                  <FormattedMessage {...messages.payment_success} />
                </section>
              </span>
            )}
            {successTransactionScreen.show && (
              <span>
                <section className={styles.icon}>
                  <AnimatedCheckmark />
                </section>
                <section>
                  <span
                    className={styles.txLink}
                    onClick={() => {
                      return blockExplorer.showTransaction(network, successTransactionScreen.txid)
                    }}
                  >
                    <FormattedMessage {...messages.transaction_success} />
                  </span>
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
