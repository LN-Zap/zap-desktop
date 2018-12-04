import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'
import { NavLink } from 'react-router-dom'
import { Box } from 'rebass'
import { Text } from 'components/UI'
import { WalletName } from '.'
import messages from './messages'

const WalletGroup = ({ setActiveWallet, title, wallets, ...rest }) => (
  <Box {...rest}>
    <Text fontWeight="normal" mb={3}>
      {title}
    </Text>
    {wallets.map(wallet => (
      <Text
        key={wallet.id}
        mb={1}
        css={{
          a: { opacity: 0.6, '&:hover': { opacity: 1 }, '&.selected': { opacity: 1 } }
        }}
      >
        <NavLink
          to={`/home/wallet/${wallet.id}`}
          activeStyle={{ fontWeight: 'normal' }}
          activeClassName="selected"
          onClick={() => setActiveWallet(wallet.id)}
          style={{
            display: 'block',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          <WalletName wallet={wallet} />
        </NavLink>
      </Text>
    ))}
  </Box>
)

class WalletsMenu extends React.Component {
  static displayName = 'WalletsMenu'

  static propTypes = {
    setActiveWallet: PropTypes.func.isRequired,
    wallets: PropTypes.array.isRequired
  }

  render() {
    const { intl, setActiveWallet, wallets, ...rest } = this.props
    const localWallets = wallets.filter(wallet => wallet.type === 'local')
    const otherWallets = wallets.filter(wallet => wallet.type !== 'local')

    return (
      <Box {...rest}>
        <WalletGroup
          title={intl.formatMessage({ ...messages.wallets_menu_local_title })}
          wallets={localWallets}
          setActiveWallet={setActiveWallet}
          mb={5}
        />
        {otherWallets.length > 0 && (
          <WalletGroup
            title={intl.formatMessage({ ...messages.wallets_menu_other_title })}
            wallets={otherWallets}
            setActiveWallet={setActiveWallet}
          />
        )}
      </Box>
    )
  }
}

export default injectIntl(WalletsMenu)
