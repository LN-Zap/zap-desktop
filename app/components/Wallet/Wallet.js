import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass'
import { btc } from 'lib/utils'
import Settings from 'containers/Settings'
import { Button, Dropdown, Text, Value } from 'components/UI'
import ZapLogo from 'components/Icon/ZapLogo'
import Qrcode from 'components/Icon/Qrcode'
import { FormattedNumber, FormattedMessage } from 'react-intl'
import messages from './messages'

const Wallet = ({
  totalBalance,
  currencyFilters,
  currentTicker,
  info,
  ticker,
  openWalletModal,
  setCurrency,
  setFormType
}) => {
  if (!currentTicker || !ticker.currency) {
    return null
  }

  const fiatAmount = btc.satoshisToFiat(totalBalance, currentTicker[ticker.fiatTicker])

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
          <Settings />
        </Box>
      </Flex>

      <Flex as="header" justifyContent="space-between" mt={4}>
        <Box as="section">
          <Flex alignItems="center">
            <Box onClick={openWalletModal} mr={3}>
              <Button variant="secondary">
                <Qrcode width="21px" height="21px" />
              </Button>
            </Box>

            <Box>
              <Flex alignItems="baseline">
                <Text fontSize="xxl">
                  <Value
                    value={totalBalance}
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
              <Text color="gray">
                {'≈ '}
                <FormattedNumber currency={ticker.fiatTicker} style="currency" value={fiatAmount} />
              </Text>
            </Box>
          </Flex>
        </Box>
        <Box as="section">
          <Button onClick={() => setFormType('PAY_FORM')} mr={2} width={145}>
            <FormattedMessage {...messages.pay} />
          </Button>
          <Button onClick={() => setFormType('REQUEST_FORM')} width={145}>
            <FormattedMessage {...messages.request} />
          </Button>
        </Box>
      </Flex>
    </Box>
  )
}

Wallet.propTypes = {
  // Store props
  totalBalance: PropTypes.number,
  currencyFilters: PropTypes.array.isRequired,
  currentTicker: PropTypes.object,
  info: PropTypes.object.isRequired,
  ticker: PropTypes.object.isRequired,

  // Dispatch props
  openWalletModal: PropTypes.func.isRequired,
  setCurrency: PropTypes.func.isRequired,
  setFormType: PropTypes.func.isRequired
}

export default Wallet
