import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Modal, ModalOverlayStyles } from 'components/UI'
import { Onboarding } from 'components/Onboarding'
import { useOnKeydown } from 'hooks'
import {
  setAlias,
  setAutopilot,
  setConnectionType,
  setConnectionHost,
  setConnectionCert,
  setConnectionMacaroon,
  setConnectionString,
  setName,
  setNetwork,
  setPassword,
  setSeed,
  setLndconnect,
  validateHost,
  validateCert,
  validateMacaroon,
  resetOnboarding,
} from 'reducers/onboarding'
import {
  setUnlockWalletError,
  setStartLndError,
  startLnd,
  stopLnd,
  fetchSeed,
  createNewWallet,
  recoverOldWallet,
  clearStartLndError,
  unlockWallet,
  lndSelectors,
} from 'reducers/lnd'

const mapStateToProps = state => ({
  alias: state.onboarding.alias,
  name: state.onboarding.name,
  autopilot: state.onboarding.autopilot,
  connectionType: state.onboarding.connectionType,
  connectionHost: state.onboarding.connectionHost,
  connectionCert: state.onboarding.connectionCert,
  connectionMacaroon: state.onboarding.connectionMacaroon,
  connectionString: state.onboarding.connectionString,
  lndConnect: state.onboarding.lndConnect,
  network: state.onboarding.network,
  isLightningGrpcActive: state.lnd.isLightningGrpcActive,
  isWalletUnlockerGrpcActive: state.lnd.isWalletUnlockerGrpcActive,
  startLndHostError: lndSelectors.startLndHostError(state),
  startLndCertError: lndSelectors.startLndCertError(state),
  startLndMacaroonError: lndSelectors.startLndMacaroonError(state),
  seed: state.onboarding.seed,
  unlockWalletError: state.lnd.unlockWalletError,
  isOnboarded: state.onboarding.isOnboarded,
  isFetchingSeed: state.lnd.isFetchingSeed,
})

const mapDispatchToProps = {
  setAlias,
  setAutopilot,
  setConnectionType,
  setConnectionHost,
  setConnectionCert,
  setConnectionMacaroon,
  setConnectionString,
  setStartLndError,
  setName,
  setNetwork,
  setPassword,
  setSeed,
  clearStartLndError,
  setUnlockWalletError,
  setLndconnect,
  startLnd,
  stopLnd,
  validateHost,
  validateCert,
  validateMacaroon,
  fetchSeed,
  createNewWallet,
  recoverOldWallet,
  resetOnboarding,
  unlockWallet,
}

const OnboardingContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Onboarding)

const ModalOverlay = styled.div`
  ${ModalOverlayStyles}
`
function OnboardingModal({ hasWallets, onClose }) {
  useOnKeydown('Escape', onClose)
  return (
    <ModalOverlay>
      <Modal hasClose={hasWallets} onClose={onClose} pt={hasWallets ? 0 : 4}>
        <OnboardingContainer />
      </Modal>
    </ModalOverlay>
  )
}

OnboardingModal.propTypes = {
  hasWallets: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default OnboardingModal
