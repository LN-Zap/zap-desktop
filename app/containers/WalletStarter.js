import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { startActiveWallet } from 'reducers/lnd'
import { Redirect } from 'react-router'
import { walletSelectors } from 'reducers/wallet'

/**
 * Auxiliary router path that starts wallet or unlocker gRPC
 * connection and redirects to a relevant path when complete
 */
class WalletStarter extends Component {
  static propTypes = {
    activeWallet: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    activeWalletSettings: PropTypes.object,
    startLndError: PropTypes.object,
    lightningGrpcActive: PropTypes.bool,
    walletUnlockerGrpcActive: PropTypes.bool,
    startActiveWallet: PropTypes.func.isRequired
  }

  componentDidMount() {
    const { startActiveWallet } = this.props
    // Catch the error and swallow it with a noop.
    // Errors are handled below by listening for updates to the startLndError prop.
    startActiveWallet().catch(() => {})
  }

  getLocation() {
    const {
      activeWallet,
      activeWalletSettings,
      lightningGrpcActive,
      startLndError,
      walletUnlockerGrpcActive
    } = this.props

    // If there was a problem starting lnd, switch to the wallet launcher.
    if (startLndError) {
      return `/home/wallet/${activeWallet}`
    }

    // If the wallet unlocker became active, switch to the login screen.
    if (walletUnlockerGrpcActive) {
      return `/home/wallet/${activeWallet}/unlock`
    }

    // If an active wallet connection has been established, switch to the app.
    if (lightningGrpcActive) {
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
  activeWallet: walletSelectors.activeWallet(state),
  activeWalletSettings: walletSelectors.activeWalletSettings(state),
  hasWallets: walletSelectors.hasWallets(state),
  lightningGrpcActive: state.lnd.lightningGrpcActive,
  walletUnlockerGrpcActive: state.lnd.walletUnlockerGrpcActive,
  startLndError: state.lnd.startLndError
})

const mapDispatchToProps = {
  startActiveWallet
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WalletStarter)
