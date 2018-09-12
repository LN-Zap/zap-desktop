import React from 'react'
import PropTypes from 'prop-types'
import Isvg from 'react-inlinesvg'
import x from 'icons/x.svg'

import TransactionModal from '../TransactionModal'
import PaymentModal from '../PaymentModal'
import InvoiceModal from '../InvoiceModal'

import styles from './ActivityModal.scss'

const ActivityModal = ({
  itemType,
  item,
  ticker,
  currentTicker,
  network,

  hideActivityModal,
  toggleCurrencyProps
}) => {
  const MODAL_COMPONENTS = {
    TRANSACTION: TransactionModal,
    PAYMENT: PaymentModal,
    INVOICE: InvoiceModal
  }

  if (!item) {
    return null
  }

  const SpecificModal = MODAL_COMPONENTS[itemType]

  return (
    <div className={styles.container}>
      <div className={styles.closeContainer}>
        <span onClick={() => hideActivityModal()}>
          <Isvg src={x} />
        </span>
      </div>
      <SpecificModal
        item={item}
        network={network}
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
  network: PropTypes.object.isRequired,
  item: PropTypes.object,
  itemType: PropTypes.string,
  hideActivityModal: PropTypes.func.isRequired
}

export default ActivityModal
