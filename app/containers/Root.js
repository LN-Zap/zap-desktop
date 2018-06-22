// @flow
import React from 'react'
import { Provider, connect } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import PropTypes from 'prop-types'

import LoadingBolt from '../components/LoadingBolt'
import Onboarding from '../components/Onboarding'
import Syncing from '../components/Onboarding/Syncing'
import {
  setConnectionType,
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
  updateAezeedPassword,
  updateAezeedPasswordConfirmation,
  submitNewWallet,
  onboardingSelectors,
  unlockWallet,
  setSignupCreate,
  setSignupImport,
  updateSeedInput
} from '../reducers/onboarding'
import { fetchBlockHeight, lndSelectors } from '../reducers/lnd'
import { newAddress } from '../reducers/address'
import Routes from '../routes'

const mapDispatchToProps = {
  setConnectionType,
  setConnectionHost,
  setConnectionCert,
  setConnectionMacaroon,
  updateAlias,
  updatePassword,
  updateCreateWalletPassword,
  updateCreateWalletPasswordConfirmation,
  updateAezeedPassword,
  updateAezeedPasswordConfirmation,
  setAutopilot,
  changeStep,
  startLnd,
  createWallet,
  submitNewWallet,
  unlockWallet,
  setSignupCreate,
  setSignupImport,
  updateSeedInput,
  newAddress,

  fetchBlockHeight
}

const mapStateToProps = state => ({
  lnd: state.lnd,
  onboarding: state.onboarding,
  address: state.address,

  syncPercentage: lndSelectors.syncPercentage(state),
  passwordIsValid: onboardingSelectors.passwordIsValid(state),
  showCreateWalletPasswordConfirmationError: onboardingSelectors.showCreateWalletPasswordConfirmationError(
    state
  ),
  showAezeedPasswordConfirmationError: onboardingSelectors.showAezeedPasswordConfirmationError(
    state
  ),
  reEnterSeedChecker: onboardingSelectors.reEnterSeedChecker(state)
})

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const syncingProps = {
    fetchBlockHeight: dispatchProps.fetchBlockHeight,
    newAddress: dispatchProps.newAddress,

    syncPercentage: stateProps.syncPercentage,
    address: stateProps.address.address
  }

  const connectionTypeProps = {
    connectionType: stateProps.onboarding.connectionType,
    setConnectionType: dispatchProps.setConnectionType
  }

  const connectionDetailProps = {
    connectionHost: stateProps.onboarding.connectionHost,
    connectionCert: stateProps.onboarding.connectionCert,
    connectionMacaroon: stateProps.onboarding.connectionMacaroon,
    setConnectionHost: dispatchProps.setConnectionHost,
    setConnectionCert: dispatchProps.setConnectionCert,
    setConnectionMacaroon: dispatchProps.setConnectionMacaroon
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
    updateCreateWalletPassword: dispatchProps.updateCreateWalletPassword,
    updateCreateWalletPasswordConfirmation: dispatchProps.updateCreateWalletPasswordConfirmation
  }

  const newAezeedPasswordProps = {
    aezeedPassword: stateProps.onboarding.aezeedPassword,
    aezeedPasswordConfirmation: stateProps.onboarding.updateAezeedPasswordConfirmation,
    showAezeedPasswordConfirmationError: stateProps.showAezeedPasswordConfirmationError,
    updateAezeedPassword: dispatchProps.updateAezeedPassword,
    updateAezeedPasswordConfirmation: dispatchProps.updateAezeedPasswordConfirmation
  }

  const recoverFormProps = {
    seedInput: stateProps.onboarding.seedInput,
    updateSeedInput: dispatchProps.updateSeedInput
  }

  const reEnterSeedProps = {
    seed: stateProps.onboarding.seed,
    seedInput: stateProps.onboarding.seedInput,
    reEnterSeedChecker: stateProps.reEnterSeedChecker,
    updateSeedInput: dispatchProps.updateSeedInput
  }

  const onboardingProps = {
    onboarding: stateProps.onboarding,
    changeStep: dispatchProps.changeStep,
    startLnd: dispatchProps.startLnd,
    submitNewWallet: dispatchProps.submitNewWallet,
    connectionTypeProps,
    connectionDetailProps,
    aliasProps,
    autopilotProps,
    initWalletProps,
    newWalletSeedProps,
    newWalletPasswordProps,
    newAezeedPasswordProps,
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

const Root = ({
  store,
  history,

  lnd,
  onboardingProps,
  syncingProps
}) => {
  // If we are syncing show the syncing screen
  if (!onboardingProps.onboarding.onboarded) {
    return <Onboarding {...onboardingProps} />
  }

  // If we are syncing show the syncing screen
  if (lnd.syncing) {
    return <Syncing {...syncingProps} />
  }

  // Don't launch the app without gRPC connection
  if (!lnd.grpcStarted) {
    return <LoadingBolt />
  }

  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Routes />
      </ConnectedRouter>
    </Provider>
  )
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
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
