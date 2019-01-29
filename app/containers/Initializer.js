import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { appSelectors } from 'reducers/app'
import { startActiveWallet } from 'reducers/lnd'
import { initCurrency, initLocale } from 'reducers/locale'
import { initWallets, walletSelectors } from 'reducers/wallet'
import { fetchTicker } from 'reducers/ticker'
import { fetchSuggestedNodes } from 'reducers/channels'

/**
 * Root component that deals with mounting the app and managing top level routing.
 */
class Initializer extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    activeWallet: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    activeWalletSettings: PropTypes.object,
    hasWallets: PropTypes.bool.isRequired,
    isWalletOpen: PropTypes.bool.isRequired,
    isReady: PropTypes.bool.isRequired,
    lightningGrpcActive: PropTypes.bool.isRequired,
    lndConnect: PropTypes.string,
    walletUnlockerGrpcActive: PropTypes.bool.isRequired,
    startLndError: PropTypes.object,
    startActiveWallet: PropTypes.func.isRequired,
    fetchSuggestedNodes: PropTypes.func.isRequired,
    fetchTicker: PropTypes.func.isRequired,
    initLocale: PropTypes.func.isRequired,
    initCurrency: PropTypes.func.isRequired,
    initWallets: PropTypes.func.isRequired
  }

  nextLocation = null

  /**
   * Initialise app state.
   */
  componentDidMount() {
    const { fetchSuggestedNodes, fetchTicker, initLocale, initCurrency, initWallets } = this.props

    initLocale()
    initCurrency()
    fetchTicker()
    fetchSuggestedNodes()
    initWallets()
  }

  /**
   * Redirect to the correct page once we establish where that should be.
   */
  componentDidUpdate(prevProps) {
    const {
      activeWallet,
      activeWalletSettings,
      isReady,
      isWalletOpen,
      hasWallets,
      history,
      lightningGrpcActive,
      lndConnect,
      startLndError,
      walletUnlockerGrpcActive,
      startActiveWallet
    } = this.props
    // If the wallet settings have just been loaded, redirect the user to the most relevant location.
    if (isReady && !prevProps.isReady) {
      // If we have an lndConnect link, send the user to the onboarding process.
      if (lndConnect) {
        this.nextLocation = '/onboarding'
      }

      // Otherwise, attempt to handle their current active wallet.
      else if (activeWalletSettings) {
        if (isWalletOpen) {
          // Catch the error and swallow it with a noop.
          // Errors are handled below by listening for updates to the startLndError prop.
          return startActiveWallet().catch(() => {})
        } else {
          this.nextLocation = `/home/wallet/${activeWallet}`
        }
      }

      // If we have at least one wallet send the user to the homepage.
      // Otherwise send them to the onboarding processes.
      else {
        this.nextLocation = hasWallets ? '/home' : '/onboarding'
      }
    }

    // If there was a problem starting lnd, swich to the wallet launcher.
    if (startLndError && !prevProps.startLndError) {
      this.nextLocation = `/home/wallet/${activeWallet}`
    }

    // If the wallet unlocker became active, switch to the login screen.
    if (walletUnlockerGrpcActive && !prevProps.walletUnlockerGrpcActive) {
      this.nextLocation = `/home/wallet/${activeWallet}/unlock`
    }

    // If an active wallet connection has been established, switch to the app.
    if (lightningGrpcActive && !prevProps.lightningGrpcActive) {
      if (activeWalletSettings.type === 'local') {
        this.nextLocation = '/syncing'
      } else {
        this.nextLocation = '/app'
      }
    }

    // Once the app is ready, and we have determined the next location, redirect the user.
    if (isReady && this.nextLocation) {
      return history.push(this.nextLocation)
    }
  }

  render() {
    return null
  }
}

const mapStateToProps = state => ({
  onboarding: state.onboarding.onboarding,
  lndConnect: state.onboarding.lndConnect,
  activeWallet: walletSelectors.activeWallet(state),
  activeWalletSettings: walletSelectors.activeWalletSettings(state),
  hasWallets: walletSelectors.hasWallets(state),
  lightningGrpcActive: state.lnd.lightningGrpcActive,
  walletUnlockerGrpcActive: state.lnd.walletUnlockerGrpcActive,
  startLndError: state.lnd.startLndError,
  isWalletOpen: state.wallet.isWalletOpen,
  isReady: appSelectors.isReady(state)
})

const mapDispatchToProps = {
  startActiveWallet,
  fetchSuggestedNodes,
  fetchTicker,
  initCurrency,
  initLocale,
  initWallets
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Initializer))
