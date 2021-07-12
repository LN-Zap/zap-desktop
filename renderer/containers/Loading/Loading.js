import React from 'react'

import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Loading from 'components/Loading'
import { accountSelectors } from 'reducers/account'
import { walletSelectors } from 'reducers/wallet'

const LoadingContainer = ({
  pathname,
  hasClose,
  isLoading,
  hasWallets,
  isAccountPasswordEnabled,
  isWalletOpen,
  onClose,
  message,
  isAccountLoading,
  isLoggedIn,
}) => {
  const getVariant = () => {
    const needsLogin = isAccountLoading || (isAccountPasswordEnabled && !isLoggedIn)

    if (needsLogin) {
      return 'bolt'
    }

    if (pathname.includes('/home') || pathname === '/app' || isWalletOpen) {
      return 'app'
    }

    if (hasWallets && (pathname === '/' || pathname === '/init')) {
      return 'launchpad'
    }

    return 'bolt'
  }

  return (
    <Loading
      hasClose={hasClose}
      isLoading={isLoading}
      message={message}
      onClose={onClose}
      variant={getVariant()}
    />
  )
}

LoadingContainer.propTypes = {
  hasClose: PropTypes.bool,
  hasWallets: PropTypes.bool,
  isAccountLoading: PropTypes.bool,
  isAccountPasswordEnabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
  isWalletOpen: PropTypes.bool,
  message: PropTypes.object,
  onClose: PropTypes.func,
  pathname: PropTypes.string.isRequired,
}

const mapStateToProps = state => ({
  hasWallets: walletSelectors.hasWallets(state),
  isLoggedIn: accountSelectors.isLoggedIn(state),
  isAccountLoading: accountSelectors.isAccountLoading(state),
  isAccountPasswordEnabled: accountSelectors.isAccountPasswordEnabled(state),
  isWalletOpen: walletSelectors.isWalletOpen(state),
  isWalletsLoaded: walletSelectors.isWalletsLoaded(state),
})

const mapDispatchToProps = {
  onCancel: () => {},
}

export default connect(mapStateToProps, mapDispatchToProps)(LoadingContainer)
