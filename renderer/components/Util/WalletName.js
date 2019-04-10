import PropTypes from 'prop-types'

const WalletName = ({ wallet }) => {
  if (!wallet) {
    return null
  }
  const { name, host, type, id } = wallet

  // For local wallets, display the wallet name if set.
  // Otherwise fallback to the wallet id.
  if (type === 'local') {
    return name || `Wallet #${id}`
  }

  // For remote wallets, use the wallet name if set.
  // Otherwise use the hostname.
  // If neither are set, provide a fallback value.
  return name || (host && host.split(':')[0]) || '[unnamed]'
}

WalletName.propTypes = {
  wallet: PropTypes.shape({
    host: PropTypes.string,
    id: PropTypes.number.isRequired,
    name: PropTypes.string,
    type: PropTypes.string.isRequired,
  }),
}

export default WalletName
