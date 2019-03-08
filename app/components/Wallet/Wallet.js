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

const Wallet = ({ totalBalance, networkInfo, openWalletModal, openModal }) => (
  <Box bg="secondaryColor" pb={3} pt={3} px={5}>
    <Flex as="header" justifyContent="space-between" pt={2}>
      <Flex alignItems="center" as="section" mt={4}>
        <ZapLogo height="32px" width="70px" />
        {networkInfo.id !== 'mainnet' && (
          <Text color="superGreen" fontSize={1} ml={2}>
            {networkInfo.name}
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
          <Box mr={3} onClick={openWalletModal}>
            <Button variant="secondary">
              <Qrcode height="21px" width="21px" />
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
        <Button mr={2} onClick={() => openModal('PAY_FORM')} width={145}>
          <FormattedMessage {...messages.pay} />
        </Button>
        <Button onClick={() => openModal('REQUEST_FORM')} width={145}>
          <FormattedMessage {...messages.request} />
        </Button>
      </Box>
    </Flex>
  </Box>
)

Wallet.propTypes = {
  networkInfo: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  openModal: PropTypes.func.isRequired,
  openWalletModal: PropTypes.func.isRequired,
  ticker: PropTypes.object.isRequired,
  totalBalance: PropTypes.number,
}

export default Wallet
