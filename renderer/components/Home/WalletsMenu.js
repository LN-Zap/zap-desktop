import React from 'react'

import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'
import { withRouter } from 'react-router-dom'
import { Box } from 'rebass/styled-components'

import { intlShape } from '@zap/i18n'
import { Text, Menu } from 'components/UI'
import { WalletName } from 'components/Util'

import messages from './messages'

const WalletGroupHeader = props => (
  <Text css="text-transform: uppercase;" fontWeight="normal" mb={2} px={3} {...props} />
)

const WalletGroup = withRouter(
  ({ history, activeWallet, setActiveWallet, title, wallets, ...rest }) => {
    /**
     * generateMenuItemId - Generate a menu item id from a wallet id.
     *
     * @param {string} walletId Wallet Id
     * @returns {string} Wallet menu item id
     */
    const generateMenuItemId = walletId => `wallet-menu-item-${walletId}`

    /**
     * generateMenuItems - Gernate a set of menu items from a list of wallets.
     *
     * @param {Array} wallets List of wallets
     * @returns {Array} List of menu items
     */
    const generateMenuItems = wallets =>
      wallets.map(wallet => {
        return {
          id: generateMenuItemId(wallet.id),
          title: <WalletName wallet={wallet} />,
          onClick: () => {
            setActiveWallet(wallet.id)
            history.push(`/home/wallet/${wallet.id}`)
          },
        }
      })

    return (
      <Box p={2} {...rest}>
        <WalletGroupHeader>{title}</WalletGroupHeader>
        <Menu
          items={generateMenuItems(wallets)}
          selectedItem={activeWallet ? generateMenuItemId(activeWallet) : null}
        />
      </Box>
    )
  }
)

WalletGroup.propTypes = {
  activeWallet: PropTypes.number,
  setActiveWallet: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  wallets: PropTypes.array,
}

WalletGroup.defaultProps = {
  wallets: [],
}

class WalletsMenu extends React.Component {
  static displayName = 'WalletsMenu'

  static propTypes = {
    activeWallet: PropTypes.number,
    intl: intlShape.isRequired,
    setActiveWallet: PropTypes.func.isRequired,
    wallets: PropTypes.array.isRequired,
  }

  render() {
    const { intl, activeWallet, setActiveWallet, wallets, ...rest } = this.props
    const localWallets = wallets.filter(wallet => wallet.type === 'local')
    const otherWallets = wallets.filter(wallet => wallet.type !== 'local')

    return (
      <Box {...rest}>
        <WalletGroup
          activeWallet={activeWallet}
          mb={5}
          setActiveWallet={setActiveWallet}
          title={intl.formatMessage({ ...messages.wallets_menu_local_title })}
          wallets={localWallets}
        />
        {otherWallets.length > 0 && (
          <WalletGroup
            activeWallet={activeWallet}
            setActiveWallet={setActiveWallet}
            title={intl.formatMessage({ ...messages.wallets_menu_other_title })}
            wallets={otherWallets}
          />
        )}
      </Box>
    )
  }
}

export default injectIntl(WalletsMenu)
