import React from 'react'
import PropTypes from 'prop-types'
import { Flex, Box } from 'rebass'
import { Card, DialogOverlay } from 'components/UI'
import { useCloseOnUnmount, useOnKeydown } from 'hooks'
import Autopay from 'components/Icon/Autopay'
import X from 'components/Icon/X'
import AutopayCreateForm from './AutopayCreateForm'

const CloseButton = ({ onClick }) => (
  <Flex color="primaryText" justifyContent="space-between">
    <Box
      css={{
        position: 'absolute',
        right: 0,
        height: '32px',
        cursor: 'pointer',
        opacity: 0.6,
        '&:hover': { opacity: 1 },
      }}
      m={3}
      ml="auto"
      onClick={onClick}
      p={2}
    >
      <X height={15} width={15} />
    </Box>
  </Flex>
)

CloseButton.propTypes = {
  onClick: PropTypes.func.isRequired,
}

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
      <Box css={{ position: 'relative' }}>
        <CloseButton onClick={onCancel} />
        <Card borderRadius={40} width={640}>
          <Box mt={2} p={2}>
            <AutopayCreateForm
              merchantName={nickname}
              merchantNickname={nickname}
              pubkey={pubkey}
            />
          </Box>
        </Card>
        <Flex css={{ position: 'absolute', top: '-25px' }} justifyContent="center" width={1}>
          <Autopay height={50} mt="-102px" width={50} />
        </Flex>
      </Box>
    </DialogOverlay>
  )
}

AutopayCreateModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  selectedMerchant: PropTypes.object.isRequired,
}

export default AutopayCreateModal
