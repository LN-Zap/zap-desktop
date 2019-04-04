import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass'
import { CryptoSelector, CryptoValue, FiatValue } from 'containers/UI'
import { Button, Text } from 'components/UI'
import Qrcode from 'components/Icon/Qrcode'

const WalletBalance = ({ totalBalance, openWalletModal }) => (
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
)

WalletBalance.propTypes = {
  openWalletModal: PropTypes.func.isRequired,
  totalBalance: PropTypes.number,
}

export default WalletBalance
