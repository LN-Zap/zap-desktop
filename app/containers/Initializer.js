import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
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
    lightningGrpcActive: PropTypes.bool.isRequired,
    walletUnlockerGrpcActive: PropTypes.bool.isRequired,
    startActiveWallet: PropTypes.func.isRequired,
    fetchSuggestedNodes: PropTypes.func.isRequired,
    fetchTicker: PropTypes.func.isRequired,
    initLocale: PropTypes.func.isRequired,
    initCurrency: PropTypes.func.isRequired,
    initWallets: PropTypes.func.isRequired
  }

  /**
   * Initialise app state.
   */
  componentDidMount() {
    const { fetchSuggestedNodes, fetchTicker, initLocale, initCurrency, initWallets } = this.props
    initLocale()
    initCurrency()
    initWallets()
    fetchTicker()
    fetchSuggestedNodes()
  }

  /**
   * Redirect to the correct page once we establish where that should be.
   */
  componentDidUpdate(prevProps) {
    const {
      activeWallet,
      activeWalletSettings,
      hasWallets,
      history,
      isWalletOpen,
      lightningGrpcActive,
      walletUnlockerGrpcActive,
      startActiveWallet
    } = this.props

    // If we have just determined that the user has an active wallet, attempt to start it.
    if (typeof activeWallet !== 'undefined' && activeWallet !== prevProps.activeWallet) {
      if (activeWalletSettings) {
        if (isWalletOpen) {
          return startActiveWallet()
        } else {
          return history.push(`/home/wallet/${activeWallet}`)
        }
      }
      // If we have an at least one wallet send the user to the homepage.
      // Otherwise send them to the onboarding processes.
      return hasWallets ? history.push('/home') : history.push('/onboarding')
    }

    // If the wallet unlocker became active, switch to the login screen
    if (walletUnlockerGrpcActive && !prevProps.walletUnlockerGrpcActive) {
      return history.push(`/home/wallet/${activeWallet}/unlock`)
    }

    // If an active wallet connection has been established, switch to the app.
    if (lightningGrpcActive && !prevProps.lightningGrpcActive) {
      if (activeWalletSettings.type === 'local') {
        return history.push('/syncing')
      } else {
        return history.push('/app')
      }
    }
  }

  render() {
    return null
  }
}

const mapStateToProps = state => ({
  onboarding: state.onboarding.onboarding,
  activeWallet: walletSelectors.activeWallet(state),
  activeWalletSettings: walletSelectors.activeWalletSettings(state),
  hasWallets: walletSelectors.hasWallets(state),
  lightningGrpcActive: state.lnd.lightningGrpcActive,
  walletUnlockerGrpcActive: state.lnd.walletUnlockerGrpcActive,
  isWalletOpen: state.wallet.isWalletOpen
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
