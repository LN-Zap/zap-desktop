import React from 'react'
import PropTypes from 'prop-types'
import X from 'components/Icon/X'

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
          <X />
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
