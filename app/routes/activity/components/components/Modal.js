import React from 'react'
import PropTypes from 'prop-types'
import ReactModal from 'react-modal'

const Modal = ({ isOpen, resetObject, children }) => {
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

  return (
    <ReactModal
      isOpen={isOpen}
      contentLabel='No Overlay Click Modal'
      ariaHideApp
      shouldCloseOnOverlayClick
      onRequestClose={() => resetObject(null)}
      parentSelector={() => document.body}
      style={customStyles}
    >
      {children}
    </ReactModal>
  )
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  resetObject: PropTypes.func.isRequired,
  children: PropTypes.object
}

export default Modal
