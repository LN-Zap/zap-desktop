import React from 'react'
import PropTypes from 'prop-types'
import ReactModal from 'react-modal'

import Transaction from './Transaction'
import Payment from './Payment'
import Invoice from './Invoice'

const Modal = ({ modalType, modalProps, hideActivityModal, ticker, currentTicker }) => {
  const MODAL_COMPONENTS = {
    TRANSACTION: Transaction,
    PAYMENT: Payment,
    INVOICE: Invoice
  
  }
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

  const SpecificModal = MODAL_COMPONENTS[modalType]

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
      <SpecificModal {...modalProps} ticker={ticker} currentTicker={currentTicker} />
    </ReactModal>
  )
}

Modal.propTypes = {
  modalType: PropTypes.string
}

export default Modal
