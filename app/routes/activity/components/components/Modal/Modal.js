import React from 'react'
import PropTypes from 'prop-types'
import ReactModal from 'react-modal'
import { MdClose } from 'react-icons/lib/md'
import Isvg from 'react-inlinesvg'

import Transaction from './Transaction'
import Payment from './Payment'
import Invoice from './Invoice'

import x from 'icons/x.svg'
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
      left: '0',
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
    <div className={styles.container}>
      <div className={styles.closeContainer}>
        <span onClick={() => hideActivityModal()}>
          <Isvg src={x} />
        </span>
      </div>
      <SpecificModal {...modalProps} ticker={ticker} currentTicker={currentTicker} />
    </div>
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
