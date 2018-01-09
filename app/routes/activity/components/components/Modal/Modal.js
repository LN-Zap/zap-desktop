import React from 'react'
import PropTypes from 'prop-types'
import ReactModal from 'react-modal'
import { FaClose } from 'react-icons/lib/fa'

import Transaction from './Transaction'
import Payment from './Payment'
import Invoice from './Invoice'

import styles from './Modal.scss'

const Modal = ({
  modalType, modalProps, hideActivityModal, ticker, currentTicker
}) => {
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
      margin: '50px auto',
      borderRadius: 'none',
      padding: '0'
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
      <div className={styles.closeContainer}>
        <span onClick={() => hideActivityModal()}>
          <FaClose />
        </span>
      </div>
      <SpecificModal {...modalProps} ticker={ticker} currentTicker={currentTicker} />
    </ReactModal>
  )
}

Modal.propTypes = {
  modalType: PropTypes.string,
  modalProps: PropTypes.object.isRequired,
  hideActivityModal: PropTypes.func.isRequired,
  ticker: PropTypes.object.isRequired,
  currentTicker: PropTypes.object.isRequired
}

export default Modal
