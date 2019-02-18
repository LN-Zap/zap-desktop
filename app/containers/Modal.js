import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { closeModal, modalSelectors } from 'reducers/modal'
import { Modal as ModalOverlay } from 'components/UI'
import Pay from 'containers/Pay'
import Request from 'containers/Request'
import Channels from 'containers/Channels'
import ChannelCreateForm from 'containers/Channels/ChannelCreateForm'
import ChannelCloseDialog from 'containers/Channels/ChannelCloseDialog'
import ChannelDetail from 'containers/Channels/ChannelDetail'

const ModalContent = ({ type, closeModal }) => {
  switch (type) {
    case 'PAY_FORM':
      return <Pay width={9 / 16} mx="auto" />

    case 'REQUEST_FORM':
      return <Request width={9 / 16} mx="auto" />

    case 'CHANNELS':
      return <Channels mx={-4} />

    case 'CHANNEL_CREATE_FORM':
      return <ChannelCreateForm onSubmit={() => closeModal()} width={9 / 16} mx="auto" />

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
  type: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired
}

const Modal = ({ modals, closeModal }) =>
  modals.map(modal => {
    return (
      <ModalOverlay onClose={() => closeModal(modal.id)} key={modal.id}>
        <ModalContent type={modal.type} closeModal={closeModal} />
      </ModalOverlay>
    )
  })

Modal.propTypes = {
  modals: PropTypes.array.isRequired,
  closeModal: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  modals: modalSelectors.getModalState(state)
})

const mapDispatchToProps = {
  closeModal
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Modal)
