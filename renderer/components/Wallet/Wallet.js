import React from 'react'
import PropTypes from 'prop-types'
import { Flex } from 'rebass'
import { Card } from 'components/UI'
import WalletBalance from './WalletBalance'
import WalletButtons from './WalletButtons'
import WalletMenu from './WalletMenu'
import WalletLogo from './WalletLogo'

const Wallet = ({ totalBalance, networkInfo, openWalletModal, openModal }) => (
  <Card bg="secondaryColor" pb={3} pt={4} px={4}>
    <Flex alignItems="flex-end" as="header" justifyContent="space-between" mt={2}>
      <WalletLogo networkInfo={networkInfo} />
      <WalletMenu openModal={openModal} />
    </Flex>

    <Flex alignItems="flex-end" as="header" justifyContent="space-between" mb={3} mt={4}>
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
  totalBalance: PropTypes.number,
}

export default Wallet
