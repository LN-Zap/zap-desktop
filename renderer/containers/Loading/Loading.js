import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Loading from 'components/Loading'
import { walletSelectors } from 'reducers/wallet'

const LoadingContainer = ({ pathname, hasClose, isLoading, hasWallets, isWalletOpen, onClose }) => {
  const getVariant = () => {
    if (pathname.includes('/home') || pathname === '/app' || isWalletOpen) {
      return 'app'
    }

    if (hasWallets && pathname === '/') {
      return 'launchpad'
    }

    return 'bolt'
  }

  return (
    <Loading hasClose={hasClose} isLoading={isLoading} onClose={onClose} variant={getVariant()} />
  )
}

LoadingContainer.propTypes = {
  hasClose: PropTypes.bool,
  hasWallets: PropTypes.bool,
  isLoading: PropTypes.bool,
  isWalletOpen: PropTypes.bool,
  onClose: PropTypes.func,
  pathname: PropTypes.string.isRequired,
}

const mapStateToProps = state => ({
  hasWallets: walletSelectors.hasWallets(state),
  isWalletOpen: walletSelectors.isWalletOpen(state),
  isWalletsLoaded: walletSelectors.isWalletsLoaded(state),
})

const mapDispatchToProps = {
  onCancel: () => {},
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoadingContainer)
