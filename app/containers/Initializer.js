import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
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
    activeWallet: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    activeWalletSettings: PropTypes.object,
    hasWallets: PropTypes.bool.isRequired,
    isWalletOpen: PropTypes.bool.isRequired,
    isReady: PropTypes.bool.isRequired,
    lndConnect: PropTypes.string,
    fetchSuggestedNodes: PropTypes.func.isRequired,
    fetchTicker: PropTypes.func.isRequired,
    initLocale: PropTypes.func.isRequired,
    initCurrency: PropTypes.func.isRequired,
    initWallets: PropTypes.func.isRequired
  }

  /**
   * Initialize app state.
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
   * Returns current location based on app initialization state and referrer
   * or null if there is no location change
   */
  getLocation() {
    const {
      activeWallet,
      activeWalletSettings,
      isReady,
      isWalletOpen,
      hasWallets,
      lndConnect
    } = this.props

    // still initializing - no location change
    if (!isReady) {
      return null
    }

    // Came here from an lnd connect link
    if (lndConnect) {
      return '/onboarding'
    }

    // we have either an open wallet or active wallet settings
    if (activeWalletSettings) {
      return isWalletOpen ? '/wallet-starter' : `/home/wallet/${activeWallet}`
    }

    // If we have at least one wallet send the user to the homepage.
    // Otherwise send them to the onboarding processes.
    return hasWallets ? '/home' : '/onboarding'
  }

  render() {
    const location = this.getLocation()
    return location && <Redirect to={location} />
  }
}

const mapStateToProps = state => ({
  onboarding: state.onboarding.onboarding,
  lndConnect: state.onboarding.lndConnect,
  activeWallet: walletSelectors.activeWallet(state),
  activeWalletSettings: walletSelectors.activeWalletSettings(state),
  hasWallets: walletSelectors.hasWallets(state),
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
)(Initializer)
