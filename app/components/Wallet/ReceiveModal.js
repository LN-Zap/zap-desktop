import React from 'react'
import PropTypes from 'prop-types'
import ReactModal from 'react-modal'
import copy from 'copy-to-clipboard'
import QRCode from 'qrcode.react'
import { showNotification } from 'notifications'
import styles from './ReceiveModal.scss'

const ReceiveModal = ({ isOpen, hideActivityModal, pubkey, address }) => {
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
      margin: '50px auto'
    }
  }

  const copyOnClick = data => {
    copy(data)
    showNotification('Noice', 'Successfully copied to clipboard')
  }

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
      <div className={styles.container}>
        <section>
          <h4>Node Public Key (<span onClick={() => copyOnClick(pubkey)}>Copy</span>)</h4>
          <p>{pubkey}</p>
        </section>

        <section>
          <h4>Deposit Address (<span onClick={() => copyOnClick(address)}>Copy</span>)</h4>
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

}

export default ReceiveModal
