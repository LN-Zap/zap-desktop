import React from 'react'
import PropTypes from 'prop-types'
import Isvg from 'react-inlinesvg'

// import Transaction from './Transaction'
import PaymentModal from './PaymentModal'
import InvoiceModal from './InvoiceModal'

import x from 'icons/x.svg'
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
    // TRANSACTION: Transaction,
    PAYMENT: PaymentModal,
    INVOICE: InvoiceModal
  }

  if (!modalType) { return null }

  const SpecificModal = MODAL_COMPONENTS[modalType]
  console.log('toggleCurrencyProps: ', toggleCurrencyProps)
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
  modalType: PropTypes.string,
  modalProps: PropTypes.object.isRequired,
  hideActivityModal: PropTypes.func.isRequired
}

export default ActivityModal
