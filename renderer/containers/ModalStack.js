import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { animated, Transition } from 'react-spring/renderprops.cjs'
import styled from 'styled-components'
import { closeModal, modalSelectors } from 'reducers/modal'
import { Modal, ModalOverlayStyles } from 'components/UI'
import { useOnKeydown } from 'hooks'
import Autopay from 'containers/Autopay'
import Pay from 'containers/Pay'
import Request from 'containers/Request'
import Channels from 'containers/Channels'
import ChannelDetailModal from 'containers/Channels/ChannelDetailModal'
import ChannelCreate from 'containers/Channels/ChannelCreate'
import ReceiveModal from 'containers/Wallet/ReceiveModal'
import ActivityModal from 'containers/Activity/ActivityModal'
import SettingsPage from 'containers/Settings/SettingsPage'
import ProfilePage from 'containers/Profile/ProfilePage'

const Container = styled(animated.div)`
  ${ModalOverlayStyles}
`

const ModalContent = ({ type, closeModal, isAnimating }) => {
  switch (type) {
    case 'SETTINGS':
      return (
        <Modal onClose={closeModal}>
          <SettingsPage />
        </Modal>
      )

    case 'PROFILE':
      return (
        <Modal onClose={closeModal}>
          <ProfilePage />
        </Modal>
      )

    case 'AUTOPAY':
      return (
        <Modal onClose={closeModal} pt={4}>
          <Autopay width={1} />
        </Modal>
      )

    case 'PAY_FORM':
      return (
        <Modal onClose={closeModal} p={4}>
          <Pay mx="auto" width={9 / 16} />
        </Modal>
      )

    case 'REQUEST_FORM':
      return (
        <Modal onClose={closeModal} p={4}>
          <Request isAnimating={isAnimating} mx="auto" width={9 / 16} />
        </Modal>
      )

    case 'RECEIVE_MODAL':
      return (
        <Modal onClose={closeModal} p={4}>
          <ReceiveModal mx="auto" width={9 / 16} />
        </Modal>
      )

    case 'ACTIVITY_MODAL':
      return (
        <Modal onClose={closeModal} p={4}>
          <ActivityModal mx="auto" width={9 / 16} />
        </Modal>
      )

    case 'CHANNELS':
      return (
        <Modal onClose={closeModal}>
          <Channels width={1} />
        </Modal>
      )

    case 'CHANNEL_CREATE':
      return (
        <Modal onClose={closeModal} py={4}>
          <ChannelCreate onSubmit={closeModal} width={1} />
        </Modal>
      )

    case 'CHANNEL_DETAIL':
      return (
        <Modal onClose={closeModal} p={4}>
          <ChannelDetailModal type="CHANNEL_DETAIL" width={1} />
        </Modal>
      )
  }
}

ModalContent.propTypes = {
  closeModal: PropTypes.func.isRequired,
  isAnimating: PropTypes.bool,
  type: PropTypes.string.isRequired,
}

/**
 * ModalStack - Render modals from the modal stack.
 *
 * @param {{ modals, closeModal }} props Props
 * @returns {Node} Node
 */
function ModalStack(props) {
  const { modals, closeModal } = props
  const doCloseModal = () => closeModal()

  useOnKeydown('Escape', closeModal)
  const [isAnimating, setIsAnimating] = useState(false)

  const onStart = () => setIsAnimating(true)
  const onRest = () => setIsAnimating(false)

  return (
    <Transition
      enter={{ opacity: 1, pointerEvents: 'auto' }}
      from={{ opacity: 0, pointerEvents: 'auto' }}
      items={modals}
      keys={item => item.id}
      leave={{ opacity: 0, pointerEvents: 'none' }}
      onRest={onRest}
      onStart={onStart}
    >
      {modal =>
        modal &&
        /* eslint-disable react/display-name */
        (styles => (
          <Container style={styles}>
            <ModalContent closeModal={doCloseModal} isAnimating={isAnimating} type={modal.type} />
          </Container>
        ))
      }
    </Transition>
  )
}

ModalStack.propTypes = {
  closeModal: PropTypes.func.isRequired,
  modals: PropTypes.array.isRequired,
}

const mapStateToProps = state => ({
  modals: modalSelectors.getModalState(state),
})

const mapDispatchToProps = {
  closeModal,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalStack)
