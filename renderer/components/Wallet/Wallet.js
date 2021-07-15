import React from 'react'

import PropTypes from 'prop-types'
import { Flex } from 'rebass/styled-components'

import { Card } from 'components/UI'

import WalletBalance from './WalletBalance'
import WalletButtons from './WalletButtons'
import WalletLogo from './WalletLogo'
import WalletMenu from './WalletMenu'

const Wallet = ({ totalBalance, networkInfo, openWalletModal, openModal }) => (
  <Card bg="secondaryColor" p={0} pb={3} pt={4}>
    <Flex alignItems="flex-end" as="header" justifyContent="space-between" mt={2} px={4}>
      <WalletLogo networkInfo={networkInfo} />
      <WalletMenu openModal={openModal} />
    </Flex>

    <Flex alignItems="flex-end" as="header" justifyContent="space-between" mb={3} mt={4} px={5}>
      <WalletBalance openWalletModal={openWalletModal} totalBalance={totalBalance} />
      <WalletButtons openModal={openModal} />
    </Flex>
  </Card>
)

Wallet.propTypes = {
  networkInfo: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  openModal: PropTypes.func.isRequired,
  openWalletModal: PropTypes.func.isRequired,
  totalBalance: PropTypes.string,
}

export default Wallet
