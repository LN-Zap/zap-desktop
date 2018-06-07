import React from 'react'
import PropTypes from 'prop-types'
import { MdClose } from 'react-icons/lib/md'
import SuccessfulSendCoins from './SuccessfulSendCoins'
import SuccessfulSendPayment from './SuccessfulSendPayment'
import WalletDetails from './WalletDetails'
import styles from './ModalRoot.scss'

const MODAL_COMPONENTS = {
  SUCCESSFUL_SEND_COINS: SuccessfulSendCoins,
  SUCCESSFUL_SEND_PAYMENT: SuccessfulSendPayment,
  WALLET_DETAILS: WalletDetails
  /* other modals */
}

const ModalRoot = ({
  modalType, modalProps, hideModal, currentTicker, currency, isTestnet
}) => {
  if (!modalType) { return null }

  const SpecificModal = MODAL_COMPONENTS[modalType]
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.esc} onClick={hideModal}>
          <MdClose />
        </div>

        <SpecificModal
          {...modalProps}
          hideModal={hideModal}
          currentTicker={currentTicker}
          currency={currency}
          isTestnet={isTestnet}
        />
      </div>
    </div>
  )
}

ModalRoot.propTypes = {
  modalType: PropTypes.string,
  modalProps: PropTypes.object,
  hideModal: PropTypes.func.isRequired,
  currentTicker: PropTypes.object.isRequired,
  currency: PropTypes.string.isRequired
}

export default ModalRoot
