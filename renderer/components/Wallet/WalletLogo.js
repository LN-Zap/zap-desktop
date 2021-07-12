import React from 'react'

import PropTypes from 'prop-types'
import { Flex } from 'rebass/styled-components'

import ZapLogo from 'components/Icon/ZapLogo'
import { Text } from 'components/UI'

const WalletLogo = ({ networkInfo }) => (
  <Flex alignItems="center" as="section">
    <ZapLogo height={28} width={28} />
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
