import React from 'react'

import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components'

import AppErrorBoundary from 'components/ErrorBoundary/AppErrorBoundary'
import Syncing from 'components/Syncing'
import { Modal, ModalOverlayStyles } from 'components/UI'
import { useOnKeydown } from 'hooks'
import { addressSelectors } from 'reducers/address'
import { infoSelectors } from 'reducers/info'
import { neutrinoSelectors } from 'reducers/neutrino'
import { showNotification } from 'reducers/notification'
import { setIsWalletOpen } from 'reducers/wallet'

const mapStateToProps = state => ({
  address: addressSelectors.currentAddress(state),
  hasSynced: infoSelectors.hasSynced(state),
  syncStatus: neutrinoSelectors.neutrinoSyncStatus(state),
  syncPercentage: neutrinoSelectors.neutrinoSyncPercentage(state),
  recoveryPercentage: neutrinoSelectors.neutrinoRecoveryPercentage(state),
  blockHeight: neutrinoSelectors.blockHeight(state),
  neutrinoBlockHeight: neutrinoSelectors.neutrinoBlockHeight(state),
  neutrinoCfilterHeight: neutrinoSelectors.neutrinoCfilterHeight(state),
  neutrinoRecoveryHeight: neutrinoSelectors.neutrinoRecoveryHeight(state),
  isAddressLoading: addressSelectors.isAddressLoading(state),
  isLightningGrpcActive: state.lnd.isLightningGrpcActive,
  network: state.info.network,
})

const mapDispatchToProps = {
  setIsWalletOpen,
  showNotification,
}

const SyncingContainer = connect(mapStateToProps, mapDispatchToProps)(Syncing)

const ModalOverlay = styled.div`
  ${ModalOverlayStyles}
`

const SyncingModal = ({ onClose, ...rest }) => {
  useOnKeydown('Escape', onClose)
  return (
    <AppErrorBoundary onCloseDialog={onClose}>
      <ModalOverlay>
        <Modal hasClose onClose={onClose} p={4} {...rest}>
          <SyncingContainer />
        </Modal>
      </ModalOverlay>
    </AppErrorBoundary>
  )
}

SyncingModal.propTypes = {
  onClose: PropTypes.func.isRequired,
}

export default SyncingModal
