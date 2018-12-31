import React from 'react'
import PropTypes from 'prop-types'
import FaAngleUp from 'react-icons/lib/fa/angle-up'
import FaAngleDown from 'react-icons/lib/fa/angle-down'
import { Box, Flex } from 'rebass'
import { btc } from 'lib/utils'
import Settings from 'components/Settings'
import { Button, Dropdown, StatusIndicator, Text, Value } from 'components/UI'
import { WalletName } from 'components/Util'
import ZapLogo from 'components/Icon/ZapLogo'
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
  activeWalletSettings,
  openPayForm,
  openRequestForm,
  currencyFilters,
  setCurrency,
  settingsProps
}) => {
  if (!ticker.currency) {
    return null
  }

  const fiatAmount = btc.satoshisToFiat(
    parseInt(balance.walletBalance, 10) + parseInt(balance.channelBalance, 10),
    currentTicker[ticker.fiatTicker]
  )

  return (
    <Box pt={3} px={5} pb={3} bg="secondaryColor">
      <Flex as="header" justifyContent="space-between" pt={2}>
        <Flex as="section" alignItems="center" mt={4}>
          <ZapLogo width="70px" height="32px" />
          {info.data.testnet && (
            <Text color="superGreen" fontSize={1} ml={2}>
              Testnet
            </Text>
          )}
        </Flex>
        <Box as="section">
          <Box css={{ position: 'relative' }}>
            <Flex
              className={`${settingsProps.settings.settingsOpen && 'settingsOpen'}`}
              onClick={settingsProps.toggleSettings}
              css={{ cursor: 'pointer' }}
            >
              <StatusIndicator variant="online" mr={2} />
              <Box
                className="settingsMenu"
                css={{ '&:hover': { opacity: '0.5', transition: 'all 0.25s' } }}
              >
                <WalletName wallet={activeWalletSettings} />
                {settingsProps.settings.settingsOpen ? <FaAngleUp /> : <FaAngleDown />}
              </Box>
            </Flex>
            {settingsProps.settings.settingsOpen && <Settings {...settingsProps} />}
          </Box>
        </Box>
      </Flex>

      <Flex as="header" justifyContent="space-between" mt={4}>
        <Box as="section">
          <Flex alignItems="center">
            <Box onClick={openReceiveModal} className={styles.qrCode} mr={3}>
              <Qrcode width="21px" height="21px" />
            </Box>

            <Box>
              <Flex alignItems="baseline">
                <Text fontSize="xxl">
                  <Value
                    value={parseFloat(balance.walletBalance) + parseFloat(balance.channelBalance)}
                    currency={ticker.currency}
                    currentTicker={currentTicker}
                    fiatTicker={ticker.fiatTicker}
                  />
                </Text>
                <Dropdown
                  activeKey={ticker.currency}
                  items={currencyFilters}
                  onChange={setCurrency}
                  ml={1}
                />
              </Flex>
              {Boolean(fiatAmount) && (
                <Text color="gray">
                  {'≈ '}
                  <FormattedNumber
                    currency={ticker.fiatTicker}
                    style="currency"
                    value={fiatAmount}
                  />
                </Text>
              )}
            </Box>
          </Flex>
        </Box>
        <Box as="section">
          <Button onClick={openPayForm} mr={2} width={145}>
            <FormattedMessage {...messages.pay} />
          </Button>
          <Button onClick={openRequestForm} width={145}>
            <FormattedMessage {...messages.request} />
          </Button>
        </Box>
      </Flex>
    </Box>
  )
}

Wallet.propTypes = {
  balance: PropTypes.object.isRequired,
  info: PropTypes.object.isRequired,
  ticker: PropTypes.object.isRequired,
  currentTicker: PropTypes.object.isRequired,
  activeWalletSettings: PropTypes.object.isRequired,
  openPayForm: PropTypes.func.isRequired,
  openRequestForm: PropTypes.func.isRequired,
  openReceiveModal: PropTypes.func.isRequired,
  network: PropTypes.object.isRequired,
  settingsProps: PropTypes.object.isRequired,
  currencyFilters: PropTypes.array.isRequired,
  setCurrency: PropTypes.func.isRequired
}

export default Wallet
