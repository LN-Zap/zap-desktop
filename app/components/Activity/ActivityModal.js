import React from 'react'
import PropTypes from 'prop-types'
import Isvg from 'react-inlinesvg'
import x from 'icons/x.svg'

import TransactionModal from './TransactionModal'
import PaymentModal from './PaymentModal'
import InvoiceModal from './InvoiceModal'

import styles from './ActivityModal.scss'

const ActivityModal = ({
  modalType,
  modalProps,
  ticker,
  currentTicker,

  hideActivityModal,
  toggleCurrencyProps
}) => {
  const MODAL_COMPONENTS = {
    TRANSACTION: TransactionModal,
    PAYMENT: PaymentModal,
    INVOICE: InvoiceModal
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
      <SpecificModal
        {...modalProps}
        ticker={ticker}
        currentTicker={currentTicker}
        toggleCurrencyProps={toggleCurrencyProps}
      />
    </div>
  )
}

ActivityModal.propTypes = {
  ticker: PropTypes.object.isRequired,
  currentTicker: PropTypes.object.isRequired,
  toggleCurrencyProps: PropTypes.object.isRequired,

  modalType: PropTypes.string,
  modalProps: PropTypes.object.isRequired,
  hideActivityModal: PropTypes.func.isRequired
}

export default ActivityModal
