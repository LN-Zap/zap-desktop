import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { animated, Transition } from 'react-spring'
import styled from 'styled-components'
import { closeModal, modalSelectors } from 'reducers/modal'
import { Modal, ModalOverlayStyles } from 'components/UI'
import { useOnKeydown } from 'hooks'
import Autopay from 'containers/Autopay'
import Pay from 'containers/Pay'
import Request from 'containers/Request'
import Channels from 'containers/Channels'
import ChannelCloseDialog from 'containers/Channels/ChannelCloseDialog'
import ChannelDetail from 'containers/Channels/ChannelDetail'
import ChannelCreate from 'containers/Channels/ChannelCreate'
import ReceiveModal from 'containers/Wallet/ReceiveModal'
import ActivityModal from 'containers/Activity/ActivityModal'

const Container = styled(animated.div)`
  ${ModalOverlayStyles}
`

const ModalContent = ({ type, closeModal }) => {
  switch (type) {
    case 'AUTOPAY':
      return <Autopay mx={-4} />

    case 'PAY_FORM':
      return <Pay mx="auto" width={9 / 16} />

    case 'REQUEST_FORM':
      return <Request mx="auto" width={9 / 16} />

    case 'RECEIVE_MODAL':
      return <ReceiveModal mx="auto" width={9 / 16} />

    case 'ACTIVITY_MODAL':
      return <ActivityModal mx="auto" width={9 / 16} />

    case 'CHANNELS':
      return <Channels mx={-4} />

    case 'CHANNEL_CREATE':
      return <ChannelCreate mx={-4} onSubmit={() => closeModal()} />

    case 'CHANNEL_DETAIL':
      return (
        <>
          <ChannelDetail mx={-4} />
          <ChannelCloseDialog />
        </>
      )
  }
}

ModalContent.propTypes = {
  closeModal: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
}

function ModalStack(props) {
  const { modals, closeModal } = props

  useOnKeydown('Escape', closeModal)

  return (
    <Transition
      enter={{ opacity: 1, pointerEvents: 'auto' }}
      from={{ opacity: 0, pointerEvents: 'auto' }}
      items={modals}
      keys={item => item.id}
      leave={{ opacity: 0, pointerEvents: 'none' }}
    >
      {modal =>
        modal &&
        /* eslint-disable react/display-name */
        (styles => (
          <Container style={styles}>
            <Modal onClose={() => closeModal(modal.id)}>
              <ModalContent closeModal={closeModal} type={modal.type} />
            </Modal>
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
