import React from 'react'
import PropTypes from 'prop-types'
import { DialogOverlay } from 'components/UI'
import { useCloseOnUnmount, useOnKeydown } from 'hooks'
import AutopayCreateForm from './AutopayCreateForm'
import AutopayModalBody from './AutopayModalBody'

const AutopayCreateModal = ({ selectedMerchant, onCancel }) => {
  const isOpen = Boolean(selectedMerchant)
  useOnKeydown('Escape', onCancel)
  useCloseOnUnmount(isOpen, onCancel)
  if (!isOpen) {
    return null
  }
  const { nickname, pubkey } = selectedMerchant

  return (
    <DialogOverlay alignItems="center" justifyContent="center">
      <AutopayModalBody onClose={onCancel}>
        <AutopayCreateForm merchantName={nickname} merchantNickname={nickname} pubkey={pubkey} />
      </AutopayModalBody>
    </DialogOverlay>
  )
}

AutopayCreateModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  selectedMerchant: PropTypes.object.isRequired,
}

export default AutopayCreateModal
