import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import { Switch, Route } from 'react-router'
import PropTypes from 'prop-types'
import { ThemeProvider } from 'styled-components'
import GlobalStyle from 'components/UI/GlobalStyle'
import GlobalError from 'components/GlobalError'
import { clearError } from 'reducers/error'

import {
  setConnectionType,
  setConnectionString,
  setConnectionHost,
  setConnectionCert,
  setConnectionMacaroon,
  updateAlias,
  updatePassword,
  setAutopilot,
  changeStep,
  startLnd,
  createWallet,
  updateCreateWalletPassword,
  updateCreateWalletPasswordConfirmation,
  submitNewWallet,
  recoverOldWallet,
  onboardingSelectors,
  unlockWallet,
  setSignupCreate,
  setSignupImport,
  updateReEnterSeedInput,
  updateRecoverSeedInput,
  setReEnterSeedIndexes
} from 'reducers/onboarding'
import { fetchTicker, tickerSelectors } from 'reducers/ticker'
import { themeSelectors } from 'reducers/theme'
import { lndSelectors } from 'reducers/lnd'
import { walletAddress } from 'reducers/address'
import LoadingBolt from 'components/LoadingBolt'
import Onboarding from 'components/Onboarding'
import Syncing from 'components/Onboarding/Syncing'

import App from './App'
import Activity from './Activity'

const mapDispatchToProps = {
  clearError,
  setConnectionType,
  setConnectionString,
  setConnectionHost,
  setConnectionCert,
  setConnectionMacaroon,
  updateAlias,
  updatePassword,
  updateCreateWalletPassword,
  updateCreateWalletPasswordConfirmation,
  setAutopilot,
  changeStep,
  startLnd,
  createWallet,
  submitNewWallet,
  recoverOldWallet,
  unlockWallet,
  setSignupCreate,
  setSignupImport,
  walletAddress,
  updateReEnterSeedInput,
  updateRecoverSeedInput,
  setReEnterSeedIndexes,
  fetchTicker
}

const mapStateToProps = state => ({
  lnd: state.lnd,
  onboarding: state.onboarding,
  address: state.address,
  info: state.info,
  balance: state.balance,
  currentTheme: themeSelectors.currentTheme(state),
  currentThemeSettings: themeSelectors.currentThemeSettings(state),
  currentTicker: tickerSelectors.currentTicker(state),
  error: state.error,
  syncPercentage: lndSelectors.syncPercentage(state),
  passwordIsValid: onboardingSelectors.passwordIsValid(state),
  passwordMinCharsError: onboardingSelectors.passwordMinCharsError(state),
  showCreateWalletPasswordConfirmationError: onboardingSelectors.showCreateWalletPasswordConfirmationError(
    state
  ),
  reEnterSeedChecker: onboardingSelectors.reEnterSeedChecker(state),
  connectionStringIsValid: onboardingSelectors.connectionStringIsValid(state),
  connectionHostIsValid: onboardingSelectors.connectionHostIsValid(state)
})

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const syncingProps = {
    blockHeight: stateProps.lnd.blockHeight,
    syncStatus: stateProps.lnd.syncStatus,
    lndBlockHeight: stateProps.lnd.lndBlockHeight,
    lndCfilterHeight: stateProps.lnd.lndCfilterHeight,
    hasSynced: stateProps.info.hasSynced,
    syncPercentage: stateProps.syncPercentage,
    address: stateProps.address.address,
    theme: stateProps.currentTheme
  }

  const connectionTypeProps = {
    connectionType: stateProps.onboarding.connectionType,
    setConnectionType: dispatchProps.setConnectionType
  }

  const connectionDetailProps = {
    connectionHostIsValid: stateProps.connectionHostIsValid,
    connectionStringIsValid: stateProps.connectionStringIsValid,
    connectionString: stateProps.onboarding.connectionString,
    connectionHost: stateProps.onboarding.connectionHost,
    connectionCert: stateProps.onboarding.connectionCert,
    connectionMacaroon: stateProps.onboarding.connectionMacaroon,
    setConnectionString: dispatchProps.setConnectionString,
    setConnectionHost: dispatchProps.setConnectionHost,
    setConnectionCert: dispatchProps.setConnectionCert,
    setConnectionMacaroon: dispatchProps.setConnectionMacaroon,
    startLndHostError: stateProps.onboarding.startLndHostError,
    startLndCertError: stateProps.onboarding.startLndCertError,
    startLndMacaroonError: stateProps.onboarding.startLndMacaroonError
  }

  const connectionConfirmProps = {
    connectionHost: stateProps.onboarding.connectionHost
  }

  const aliasProps = {
    updateAlias: dispatchProps.updateAlias,
    alias: stateProps.onboarding.alias
  }

  const autopilotProps = {
    autopilot: stateProps.onboarding.autopilot,
    setAutopilot: dispatchProps.setAutopilot
  }

  const initWalletProps = {
    hasSeed: stateProps.onboarding.hasSeed,

    loginProps: {
      password: stateProps.onboarding.password,
      passwordIsValid: stateProps.passwordIsValid,
      hasSeed: stateProps.onboarding.hasSeed,
      existingWalletDir: stateProps.onboarding.existingWalletDir,
      unlockingWallet: stateProps.onboarding.unlockingWallet,
      unlockWalletError: stateProps.onboarding.unlockWalletError,

      updatePassword: dispatchProps.updatePassword,
      createWallet: dispatchProps.createWallet,
      unlockWallet: dispatchProps.unlockWallet
    },

    signupProps: {
      signupForm: stateProps.onboarding.signupForm,

      setSignupCreate: dispatchProps.setSignupCreate,
      setSignupImport: dispatchProps.setSignupImport
    }
  }

  const newWalletSeedProps = {
    seed: stateProps.onboarding.seed
  }

  const newWalletPasswordProps = {
    createWalletPassword: stateProps.onboarding.createWalletPassword,
    createWalletPasswordConfirmation: stateProps.onboarding.createWalletPasswordConfirmation,
    showCreateWalletPasswordConfirmationError: stateProps.showCreateWalletPasswordConfirmationError,
    passwordMinCharsError: stateProps.passwordMinCharsError,
    updateCreateWalletPassword: dispatchProps.updateCreateWalletPassword,
    updateCreateWalletPasswordConfirmation: dispatchProps.updateCreateWalletPasswordConfirmation
  }

  const recoverFormProps = {
    recoverSeedInput: stateProps.onboarding.recoverSeedInput,
    updateRecoverSeedInput: dispatchProps.updateRecoverSeedInput
  }

  const reEnterSeedProps = {
    seed: stateProps.onboarding.seed,
    reEnterSeedInput: stateProps.onboarding.reEnterSeedInput,
    seedIndexesArr: stateProps.onboarding.seedIndexesArr,
    reEnterSeedChecker: stateProps.reEnterSeedChecker,
    updateReEnterSeedInput: dispatchProps.updateReEnterSeedInput,
    setReEnterSeedIndexes: dispatchProps.setReEnterSeedIndexes
  }

  const onboardingProps = {
    onboarding: stateProps.onboarding,
    theme: stateProps.currentTheme,
    changeStep: dispatchProps.changeStep,
    startLnd: dispatchProps.startLnd,
    submitNewWallet: dispatchProps.submitNewWallet,
    recoverOldWallet: dispatchProps.recoverOldWallet,
    connectionTypeProps,
    connectionDetailProps,
    connectionConfirmProps,
    aliasProps,
    autopilotProps,
    initWalletProps,
    newWalletSeedProps,
    newWalletPasswordProps,
    recoverFormProps,
    reEnterSeedProps
  }

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,

    onboardingProps,
    syncingProps
  }
}

class Root extends Component {
  componentWillMount() {
    const { fetchTicker } = this.props
    fetchTicker()
  }

  render() {
    const {
      balance,
      clearError,
      currentThemeSettings,
      currentTicker,
      error: { error },
      history,
      lnd,
      onboardingProps,
      syncingProps
    } = this.props

    if (!onboardingProps.onboarding.onboarded) {
      return (
        <React.Fragment>
          <GlobalStyle />
          <ThemeProvider theme={currentThemeSettings}>
            <div>
              <LoadingBolt
                theme={onboardingProps.theme}
                visible={!onboardingProps.onboarding.onboarding}
              />
              <GlobalError error={error} clearError={clearError} />
              <Onboarding {...onboardingProps} />
              <Syncing {...syncingProps} />
            </div>
          </ThemeProvider>
        </React.Fragment>
      )
    }

    // If we are syncing show the syncing screen.
    if (
      lnd.lightningGrpcActive &&
      onboardingProps.onboarding.connectionType === 'local' &&
      lnd.syncStatus !== 'complete'
    ) {
      return (
        <React.Fragment>
          <GlobalStyle />
          <ThemeProvider theme={currentThemeSettings}>
            <Syncing {...syncingProps} />
          </ThemeProvider>
        </React.Fragment>
      )
    }

    return (
      <React.Fragment>
        <GlobalStyle />
        <ConnectedRouter history={history}>
          <ThemeProvider theme={currentThemeSettings}>
            <div>
              <LoadingBolt
                theme={onboardingProps.theme}
                visible={
                  (!lnd.lightningGrpcActive && !lnd.walletUnlockerGrpcActive) ||
                  !currentTicker ||
                  balance.channelBalance === null ||
                  balance.walletBalance === null
                }
              />
              <App>
                <Switch>
                  <Route path="/" component={Activity} />
                </Switch>
              </App>
            </div>
          </ThemeProvider>
        </ConnectedRouter>
      </React.Fragment>
    )
  }
}

Root.propTypes = {
  balance: PropTypes.object.isRequired,
  clearError: PropTypes.func.isRequired,
  error: PropTypes.object.isRequired,
  fetchTicker: PropTypes.func.isRequired,
  currentThemeSettings: PropTypes.object.isRequired,
  currentTicker: PropTypes.object,
  history: PropTypes.object.isRequired,
  lnd: PropTypes.object.isRequired,
  onboardingProps: PropTypes.object.isRequired,
  syncingProps: PropTypes.object.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Root)
