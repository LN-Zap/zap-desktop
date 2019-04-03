import React from 'react'
import PropTypes from 'prop-types'
import { Flex } from 'rebass'
import { Text } from 'components/UI'
import ZapLogo from 'components/Icon/ZapLogo'

const WalletLogo = ({ networkInfo }) => (
  <Flex alignItems="center" as="section">
    <ZapLogo height="32px" width="70px" />
    {networkInfo.id !== 'mainnet' && (
      <Text color="superGreen" fontSize="xs" ml={2}>
        {networkInfo.name}
      </Text>
    )}
  </Flex>
)

WalletLogo.propTypes = {
  networkInfo: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
}

export default WalletLogo
