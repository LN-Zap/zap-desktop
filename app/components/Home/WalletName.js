import PropTypes from 'prop-types'

const WalletName = ({ wallet }) => {
  if (!wallet) {
    return null
  }

  if (wallet.type === 'local') {
    return wallet.name || `Wallet #${wallet.id}`
  }
  return wallet.name || wallet.host.split(':')[0]
}

WalletName.propTypes = {
  wallet: PropTypes.object.isRequired
}

export default WalletName
