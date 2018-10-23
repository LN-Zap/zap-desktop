import { connect } from 'react-redux'

import { themeSelectors } from 'reducers/theme'
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

import Onboarding from 'components/Onboarding'

const mapDispatchToProps = {
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
  updateReEnterSeedInput,
  updateRecoverSeedInput,
  setReEnterSeedIndexes
}

const mapStateToProps = state => ({
  currentTheme: themeSelectors.currentTheme(state),
  onboarding: state.onboarding,
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
    ...onboardingProps
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Onboarding)
