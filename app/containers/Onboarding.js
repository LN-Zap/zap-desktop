import { connect } from 'react-redux'
import { Onboarding } from 'components/Onboarding'
import {
  setAlias,
  setAutopilot,
  setConnectionType,
  setConnectionHost,
  setConnectionCert,
  setConnectionMacaroon,
  setConnectionString,
  setPassword,
  setUnlockWalletError,
  startLnd,
  stopLnd,
  validateHost,
  validateCert,
  validateMacaroon,
  generateSeed,
  createNewWallet,
  recoverOldWallet,
  resetOnboarding,
  unlockWallet
} from 'reducers/onboarding'

const mapStateToProps = state => ({
  alias: state.onboarding.alias,
  autopilot: state.onboarding.autopilot,
  connectionType: state.onboarding.connectionType,
  connectionHost: state.onboarding.connectionHost,
  connectionCert: state.onboarding.connectionCert,
  connectionMacaroon: state.onboarding.connectionMacaroon,
  connectionString: state.onboarding.connectionString,
  lndWalletStarted: state.onboarding.lndWalletStarted,
  lndWalletUnlockerStarted: state.onboarding.lndWalletUnlockerStarted,
  startLndHostError: state.onboarding.startLndHostError,
  startLndCertError: state.onboarding.startLndCertError,
  startLndMacaroonError: state.onboarding.startLndMacaroonError,
  seed: state.onboarding.seed,
  signupMode: state.onboarding.signupMode,
  unlockWalletError: state.onboarding.unlockWalletError,
  onboarded: state.onboarding.onboarded,
  fetchingSeed: state.onboarding.fetchingSeed
})

const mapDispatchToProps = {
  setAlias,
  setAutopilot,
  setConnectionType,
  setConnectionHost,
  setConnectionCert,
  setConnectionMacaroon,
  setConnectionString,
  setPassword,
  setUnlockWalletError,
  startLnd,
  stopLnd,
  validateHost,
  validateCert,
  validateMacaroon,
  generateSeed,
  createNewWallet,
  recoverOldWallet,
  resetOnboarding,
  unlockWallet
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Onboarding)
