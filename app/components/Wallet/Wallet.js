import React from 'react'
import PropTypes from 'prop-types'
import FaAngleUp from 'react-icons/lib/fa/angle-up'
import FaAngleDown from 'react-icons/lib/fa/angle-down'
import { Box, Flex } from 'rebass'
import { btc, blockExplorer } from 'lib/utils'
import Value from 'components/Value'
import Settings from 'components/Settings'
import Button from 'components/UI/Button'
import Text from 'components/UI/Text'
import Dropdown from 'components/UI/Dropdown'

import CheckAnimated from 'components/Icon/CheckAnimated'
import ZapLogo from 'components/Icon/ZapLogo'
import ZapLogoBlack from 'components/Icon/ZapLogoBlack'
import Qrcode from 'components/Icon/Qrcode'

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
  currencyFilters,
  setCurrency,
  network,
  settingsProps,
  paymentTimeout,
  theme
}) => {
  const fiatAmount = btc.satoshisToFiat(
    parseInt(balance.walletBalance, 10) + parseInt(balance.channelBalance, 10),
    currentTicker[ticker.fiatTicker].last
  )

  return (
    <div className={`${styles.wallet}`}>
      <Flex as="header" justifyContent="space-between">
        <Flex as="section" alignItems="center">
          {theme === 'light' ? (
            <ZapLogoBlack width="70px" height="32px" />
          ) : (
            <ZapLogo width="70px" height="32px" />
          )}
          {info.data.testnet && (
            <Text color="superGreen" fontSize={1} ml={2}>
              Testnet
            </Text>
          )}
        </Flex>
        <Box as="section">
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
        </Box>
      </Flex>

      <Flex as="header" justifyContent="space-between" mt={4}>
        <Box as="section">
          <Flex alignItems="baseline">
            <Box onClick={openReceiveModal} className={styles.qrCode} mr={2}>
              <Qrcode width="20px" height="20px" />
            </Box>
            <Flex flexDirection="column">
              <Text fontSize="24px" letterSpacing={2}>
                <Value
                  value={parseFloat(balance.walletBalance) + parseFloat(balance.channelBalance)}
                  currency={ticker.currency}
                  currentTicker={currentTicker}
                  fiatTicker={ticker.fiatTicker}
                />
              </Text>
            </Flex>
            <Dropdown
              activeKey={ticker.currency}
              items={currencyFilters}
              onChange={setCurrency}
              ml={2}
            />
          </Flex>
          <Box ml={30} mt={1}>
            {Boolean(fiatAmount) && (
              <span>
                {'≈ '}
                <FormattedNumber currency={ticker.fiatTicker} style="currency" value={fiatAmount} />
              </span>
            )}
          </Box>
        </Box>
        <Box as="section">
          <Button onClick={openPayForm} variant="primary" mx={7.5} width={100}>
            <FormattedMessage {...messages.pay} />
          </Button>
          <Button onClick={openRequestForm} variant="primary" mx={7.5} width={100}>
            <FormattedMessage {...messages.request} />
          </Button>
        </Box>
      </Flex>

      <Box mt={2}>
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
                <CheckAnimated />
              </section>
              <section>
                <FormattedMessage {...messages.payment_success} />
              </section>
            </span>
          )}
          {successTransactionScreen.show && (
            <span>
              <section className={styles.icon}>
                <CheckAnimated />
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
      </Box>
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
  currencyFilters: PropTypes.array.isRequired,
  currencyName: PropTypes.string.isRequired,
  paymentTimeout: PropTypes.number.isRequired,
  setCurrency: PropTypes.func.isRequired
}

export default Wallet
