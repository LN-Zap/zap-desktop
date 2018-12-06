import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'components/UI'
import TransactionModal from '../TransactionModal'
import PaymentModal from '../PaymentModal'
import InvoiceModal from '../InvoiceModal'

const MODAL_COMPONENTS = {
  TRANSACTION: TransactionModal,
  PAYMENT: PaymentModal,
  INVOICE: InvoiceModal
}

const ActivityModal = ({
  itemType,
  item,
  ticker,
  currentTicker,
  network,
  hideActivityModal,
  toggleCurrencyProps
}) => {
  if (!item) {
    return null
  }

  const SpecificModal = MODAL_COMPONENTS[itemType]

  return (
    <Modal onClose={hideActivityModal}>
      <SpecificModal
        item={item}
        network={network}
        ticker={ticker}
        currentTicker={currentTicker}
        toggleCurrencyProps={toggleCurrencyProps}
      />
    </Modal>
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
