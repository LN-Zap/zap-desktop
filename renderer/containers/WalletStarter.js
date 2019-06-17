import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { getWalletRedirect } from 'reducers/utils'
import { startActiveWallet } from 'reducers/lnd'
import { Redirect } from 'react-router'
import { walletSelectors } from 'reducers/wallet'

/**
 * Auxiliary router path that starts wallet or unlocker gRPC
 * connection and redirects to a relevant path when complete
 */
class WalletStarter extends Component {
  static propTypes = {
    activeWalletSettings: PropTypes.object,
    isLightningGrpcActive: PropTypes.bool,
    isWalletUnlockerGrpcActive: PropTypes.bool,
    startActiveWallet: PropTypes.func.isRequired,
    startLndError: PropTypes.object,
  }

  componentDidMount() {
    const { startActiveWallet } = this.props
    // Catch the error and swallow it with a noop.
    // Errors are handled below by listening for updates to the startLndError prop.
    startActiveWallet().catch(() => {})
  }

  getLocation() {
    const {
      activeWalletSettings,
      isLightningGrpcActive,
      startLndError,
      isWalletUnlockerGrpcActive,
    } = this.props

    // If there was a problem starting lnd, switch to the wallet launcher.
    if (startLndError) {
      return getWalletRedirect(activeWalletSettings)
    }

    // If the wallet unlocker became active, switch to the login screen.
    if (isWalletUnlockerGrpcActive) {
      return getWalletRedirect(activeWalletSettings, '/unlock')
    }

    // If an active wallet connection has been established, switch to the app.
    if (isLightningGrpcActive) {
      return activeWalletSettings.type === 'local' ? '/syncing' : '/app'
    }

    // no location change for now
    return null
  }

  render() {
    const location = this.getLocation()
    return location && <Redirect to={location} />
  }
}

const mapStateToProps = state => ({
  activeWalletSettings: walletSelectors.activeWalletSettings(state),
  hasWallets: walletSelectors.hasWallets(state),
  isLightningGrpcActive: state.lnd.isLightningGrpcActive,
  isWalletUnlockerGrpcActive: state.lnd.isWalletUnlockerGrpcActive,
  startLndError: state.lnd.startLndError,
})

const mapDispatchToProps = {
  startActiveWallet,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WalletStarter)
