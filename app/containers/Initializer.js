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
    isWalletOpen: PropTypes.bool,
    lightningGrpcActive: PropTypes.bool,
    walletUnlockerGrpcActive: PropTypes.bool,
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
      history,
      activeWallet,
      activeWalletSettings,
      isWalletOpen,
      lightningGrpcActive,
      walletUnlockerGrpcActive,
      startActiveWallet
    } = this.props

    // If we have just determined that the user has an active wallet, attempt to start it.
    if (typeof activeWallet !== 'undefined') {
      if (activeWalletSettings) {
        if (isWalletOpen) {
          startActiveWallet()
        } else {
          return history.push(`/home/wallet/${activeWallet}`)
        }
      }
      // If we have an active wallet set, but can't find it's settings then send the user to the homepage.
      else {
        return history.push('/home')
      }
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
