import React from 'react'
import PropTypes from 'prop-types'
import ReactModal from 'react-modal'
import copy from 'copy-to-clipboard'
import QRCode from 'qrcode.react'
import { showNotification } from 'notifications'
import { FaCopy } from 'react-icons/lib/fa'
import { MdClose } from 'react-icons/lib/md'
import styles from './ReceiveModal.scss'

const ReceiveModal = ({
  isOpen, hideActivityModal, pubkey, address, newAddress, qrCodeType, changeQrCode
}) => {
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
      margin: '50px auto',
      borderRadius: 'none',
      padding: '0'
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
      <div className={styles.closeContainer}>
        <span onClick={() => hideActivityModal()}>
          <MdClose />
        </span>
      </div>

      <div className={styles.container}>
        <header>
          <div className={styles.qrcodes}>
            <QRCode value={qrCodeType === 1 ? address : pubkey} />
          </div>

          <ul className={styles.tabs}>
            <li className={qrCodeType === 1 && styles.active} onClick={changeQrCode}>
              Wallet address
            </li>
            <li className={qrCodeType === 2 && styles.active} onClick={changeQrCode}>
              Node pubkey
            </li>
          </ul>
        </header>
        <section>
          <div className={styles.addressHeader}>
            <h4>Deposit Address</h4>
            <span className={styles.newAddress} onClick={() => newAddress('np2wkh')}>New Address</span>
          </div>
          <p>
            <span>{address}</span>
            <span onClick={() => copyOnClick(address)} className='hint--left' data-hint='Copy address'>
              <FaCopy />
            </span>
          </p>
        </section>

        <section>
          <h4>Node Public Key</h4>
          <p>
            <span>{pubkey}</span>
            <span onClick={() => copyOnClick(pubkey)} className='hint--left' data-hint='Copy pubkey'>
              <FaCopy />
            </span>
          </p>
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
  newAddress: PropTypes.func.isRequired,
  changeQrCode: PropTypes.func.isRequired,
  qrCodeType: PropTypes.number.isRequired
}

export default ReceiveModal
