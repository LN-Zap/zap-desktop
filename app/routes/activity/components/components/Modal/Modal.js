import React from 'react'
import PropTypes from 'prop-types'
import ReactModal from 'react-modal'

const Modal = ({ modalType, modalProps, hideActivityModal }) => {
  const customStyles = {
    overlay: {
      cursor: 'pointer'
    },
    content: {
      top: 'auto',
      left: '20%',
      right: '0',
      bottom: 'auto',
      width: '40%',
      margin: '50px auto'
    }
  }
  
  if (!modalType) { return null }

  return (
    <ReactModal
      isOpen
      ariaHideApp
      shouldCloseOnOverlayClick
      contentLabel='No Overlay Click Modal'
      onRequestClose={() => hideActivityModal()}
      parentSelector={() => document.body}
      style={customStyles}
    >
      <h1>hi!</h1>
    </ReactModal>
  )
}

Modal.propTypes = {
  modalType: PropTypes.string
}

export default Modal
