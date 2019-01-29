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
  wallet: PropTypes.shape({
    id: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    host: PropTypes.string,
    name: PropTypes.string
  })
}

export default WalletName
