import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styled, { withTheme } from 'styled-components'
import { infoSelectors } from 'reducers/info'
import { lndSelectors } from 'reducers/lnd'
import { setIsWalletOpen } from 'reducers/wallet'
import { showNotification } from 'reducers/notification'
import { Syncing } from 'components/Syncing'
import { Modal, ModalOverlayStyles } from 'components/UI'
import { useOnKeydown } from 'hooks'

const mapStateToProps = state => ({
  address: state.address.address,
  hasSynced: infoSelectors.hasSynced(state),
  syncStatus: state.lnd.syncStatus,
  syncPercentage: lndSelectors.syncPercentage(state),
  blockHeight: state.lnd.blockHeight,
  lndBlockHeight: state.lnd.lndBlockHeight,
  lndCfilterHeight: state.lnd.lndCfilterHeight,
  isLightningGrpcActive: state.lnd.isLightningGrpcActive,
  network: state.info.network,
})

const mapDispatchToProps = {
  setIsWalletOpen,
  showNotification,
}

const SyncingContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTheme(Syncing))

const ModalOverlay = styled.div`
  ${ModalOverlayStyles}
`

function SyncingModal({ onClose, ...rest }) {
  useOnKeydown('Escape', onClose)
  return (
    <ModalOverlay>
      <Modal hasClose onClose={onClose} {...rest}>
        <SyncingContainer />
      </Modal>
    </ModalOverlay>
  )
}

SyncingModal.propTypes = {
  onClose: PropTypes.func.isRequired,
}

export default SyncingModal
