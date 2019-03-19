import React from 'react'
import PropTypes from 'prop-types'
import { intlShape, injectIntl } from 'react-intl'
import { NavLink } from 'react-router-dom'
import { Box } from 'rebass'
import { Text } from 'components/UI'
import { WalletName } from 'components/Util'
import messages from './messages'

const WalletGroup = ({ setActiveWallet, title, wallets, ...rest }) => (
  <Box {...rest}>
    <Text fontWeight="normal" mb={3}>
      {title}
    </Text>
    {wallets.map(wallet => (
      <Text
        key={wallet.id}
        css={{
          a: { opacity: 0.6, '&:hover': { opacity: 1 }, '&.selected': { opacity: 1 } },
        }}
        mb={1}
      >
        <NavLink
          activeClassName="selected"
          activeStyle={{ fontWeight: 'normal' }}
          onClick={() => setActiveWallet(wallet.id)}
          style={{
            display: 'block',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          to={`/home/wallet/${wallet.id}`}
        >
          <WalletName wallet={wallet} />
        </NavLink>
      </Text>
    ))}
  </Box>
)

WalletGroup.propTypes = {
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
    intl: intlShape.isRequired,
    setActiveWallet: PropTypes.func.isRequired,
    wallets: PropTypes.array.isRequired,
  }

  render() {
    const { intl, setActiveWallet, wallets, ...rest } = this.props
    const localWallets = wallets.filter(wallet => wallet.type === 'local')
    const otherWallets = wallets.filter(wallet => wallet.type !== 'local')

    return (
      <Box {...rest}>
        <WalletGroup
          mb={5}
          setActiveWallet={setActiveWallet}
          title={intl.formatMessage({ ...messages.wallets_menu_local_title })}
          wallets={localWallets}
        />
        {otherWallets.length > 0 && (
          <WalletGroup
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
