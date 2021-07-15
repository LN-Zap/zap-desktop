import React from 'react'

import PropTypes from 'prop-types'

import { DialogOverlay } from 'components/UI'

import AutopayCreateForm from './AutopayCreateForm'
import AutopayModalBody from './AutopayModalBody'

const AutopayCreateModal = ({
  selectedMerchant,
  onClose,
  isEditMode,
  onCreateAutopay,
  showError,
  onRemoveAutopay,
  showNotification,
}) => {
  const isOpen = Boolean(selectedMerchant)
  if (!isOpen) {
    return null
  }
  const { nickname, pubkey, image, isActive, limit } = selectedMerchant
  return (
    <DialogOverlay alignItems="center" justifyContent="center">
      <AutopayModalBody onClose={onClose}>
        <AutopayCreateForm
          isActive={isActive}
          isEditMode={isEditMode}
          limit={limit}
          merchantLogo={image}
          merchantName={nickname}
          merchantNickname={nickname}
          onClose={onClose}
          onCreateAutopay={onCreateAutopay}
          onRemoveAutopay={onRemoveAutopay}
          pubkey={pubkey}
          showError={showError}
          showNotification={showNotification}
        />
      </AutopayModalBody>
    </DialogOverlay>
  )
}

AutopayCreateModal.propTypes = {
  isEditMode: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreateAutopay: PropTypes.func.isRequired,
  onRemoveAutopay: PropTypes.func.isRequired,
  selectedMerchant: PropTypes.object,
  showError: PropTypes.func.isRequired,
  showNotification: PropTypes.func.isRequired,
}

export default AutopayCreateModal
