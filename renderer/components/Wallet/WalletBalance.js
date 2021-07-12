import React from 'react'

import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'
import { Box, Flex } from 'rebass/styled-components'

import Qrcode from 'components/Icon/Qrcode'
import { Button, Text } from 'components/UI'
import { CryptoSelector, CryptoValue, FiatValue } from 'containers/UI'

import messages from './messages'

const WalletBalance = ({ totalBalance, openWalletModal }) => {
  const { formatMessage } = useIntl()
  const approximateFiatBalance = () => (
    /* eslint-disable shopify/jsx-no-hardcoded-content */
    <Text color="gray">
      ≈&nbsp;
      <FiatValue style="currency" value={totalBalance} />
    </Text>
    /* eslint-enable shopify/jsx-no-hardcoded-content */
  )

  return (
    <Box as="section">
      <Flex alignItems="center">
        <Box mr={3} onClick={openWalletModal}>
          <Button variant="secondary">
            <Text
              className="hint--top-right"
              data-hint={formatMessage({ ...messages.qrcode_tooltip })}
              fontWeight="light"
            >
              <Qrcode height="21px" width="21px" />
            </Text>
          </Button>
        </Box>

        <Box>
          <Flex alignItems="baseline">
            <Text fontSize="xxl">
              <CryptoValue value={totalBalance} />
            </Text>
            <CryptoSelector ml={1} />
          </Flex>
          {approximateFiatBalance()}
        </Box>
      </Flex>
    </Box>
  )
}

WalletBalance.propTypes = {
  openWalletModal: PropTypes.func.isRequired,
  totalBalance: PropTypes.string,
}

export default WalletBalance
