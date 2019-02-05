import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass'
import Settings from 'containers/Settings'
import { CryptoSelector, CryptoValue, FiatValue } from 'containers/UI'
import { Button, Text } from 'components/UI'
import ZapLogo from 'components/Icon/ZapLogo'
import Qrcode from 'components/Icon/Qrcode'
import { FormattedMessage } from 'react-intl'
import messages from './messages'

const Wallet = ({ totalBalance, currentTicker, info, ticker, openWalletModal, setFormType }) => {
  if (!currentTicker || !ticker.currency) {
    return null
  }

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
                  <CryptoValue value={totalBalance} />
                </Text>
                <CryptoSelector ml={1} />
              </Flex>
              <Text color="gray">
                {'≈ '}
                <FiatValue style="currency" value={totalBalance} />
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
  currentTicker: PropTypes.object,
  info: PropTypes.object.isRequired,
  ticker: PropTypes.object.isRequired,

  // Dispatch props
  openWalletModal: PropTypes.func.isRequired,
  setFormType: PropTypes.func.isRequired
}

export default Wallet
