import React from 'react'
import PropTypes from 'prop-types'
import { MdClose } from 'react-icons/lib/md'
import SuccessfulSendCoins from './SuccessfulSendCoins'
import styles from './ModalRoot.scss'

const MODAL_COMPONENTS = {
  SUCCESSFUL_SEND_COINS: SuccessfulSendCoins
  /* other modals */
}

const ModalRoot = ({ modalType, modalProps, hideModal, currentTicker, currency }) => {
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
        />
      </div>
    </div>
  )
}

ModalRoot.propTypes = {
  modalType: PropTypes.string,
  modalProps: PropTypes.object.isRequired,
  hideModal: PropTypes.func.isRequired,
  currentTicker: PropTypes.object.isRequired,
  currency: PropTypes.string.isRequired
}

export default ModalRoot
