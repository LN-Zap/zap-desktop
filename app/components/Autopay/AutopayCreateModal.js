import React from 'react'
import PropTypes from 'prop-types'
import { DialogOverlay } from 'components/UI'
import { useCloseOnUnmount, useOnKeydown } from 'hooks'
import AutopayCreateForm from './AutopayCreateForm'
import AutopayModalBody from './AutopayModalBody'

const AutopayCreateModal = ({
  selectedMerchant,
  onClose,
  onCreateAutopay,
  showError,
  showNotification,
}) => {
  const isOpen = Boolean(selectedMerchant)
  useOnKeydown('Escape', onClose)
  useCloseOnUnmount(isOpen, onClose)
  if (!isOpen) {
    return null
  }
  const { nickname, pubkey, image, isActive } = selectedMerchant

  return (
    <DialogOverlay alignItems="center" justifyContent="center">
      <AutopayModalBody onClose={onClose}>
        <AutopayCreateForm
          isActive={isActive}
          merchantLogo={image}
          merchantName={nickname}
          merchantNickname={nickname}
          onClose={onClose}
          onCreateAutopay={onCreateAutopay}
          pubkey={pubkey}
          showError={showError}
          showNotification={showNotification}
        />
      </AutopayModalBody>
    </DialogOverlay>
  )
}

AutopayCreateModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onCreateAutopay: PropTypes.func.isRequired,
  selectedMerchant: PropTypes.object,
  showError: PropTypes.func.isRequired,
  showNotification: PropTypes.func.isRequired,
}

export default AutopayCreateModal
