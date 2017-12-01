import React from 'react'
import PropTypes from 'prop-types'
import ReactModal from 'react-modal'
import copy from 'copy-to-clipboard'
import QRCode from 'qrcode.react'
import { showNotification } from 'notifications'
import styles from './ReceiveModal.scss'

const ReceiveModal = ({ isOpen, hideActivityModal, pubkey, address, newAddress }) => {
  const customStyles = {
    overlay: {
      cursor: 'pointer'
    },
    content: {
      top: 'auto',
      left: '20%',
      right: '0',
      bottom: 'auto',
      width: '60%',
      margin: '50px auto'
    }
  }

  const copyOnClick = (data) => {
    copy(data)
    showNotification('Noice', 'Successfully copied to clipboard')
  }

  return (
    <ReactModal
      isOpen={isOpen}
      ariaHideApp
      shouldCloseOnOverlayClick
      contentLabel='No Overlay Click Modal'
      onRequestClose={() => hideActivityModal()}
      parentSelector={() => document.body}
      style={customStyles}
    >
      <div className={styles.container}>
        <section>
          <h4>Node Public Key (<span onClick={() => copyOnClick(pubkey)}>Copy</span>)</h4>
          <p>{pubkey}</p>
        </section>

        <section>
          <div className={styles.addressHeader}>
            <h4>Deposit Address (<span onClick={() => copyOnClick(address)}>Copy</span>)</h4>
            <span className={styles.newAddress} onClick={() => newAddress('p2pkh')}>New Address</span>
          </div>
          <p>{address}</p>

          <div className={styles.qrcode}>
            <QRCode value={address} />
          </div>
        </section>
      </div>
    </ReactModal>
  )
}

ReceiveModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  hideActivityModal: PropTypes.func.isRequired,
  pubkey: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  newAddress: PropTypes.func.isRequired
}

export default ReceiveModal
