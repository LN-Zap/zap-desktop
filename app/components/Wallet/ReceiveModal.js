import React from 'react'
import PropTypes from 'prop-types'
import copy from 'copy-to-clipboard'
import QRCode from 'qrcode.react'
import { FaCopy } from 'react-icons/lib/fa'
import Isvg from 'react-inlinesvg'

import x from 'icons/x.svg'
import { showNotification } from 'notifications'

import styles from './ReceiveModal.scss'

class ReceiveModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      qrCodeType: 1
    }
  }

  render() {
    const copyOnClick = (data) => {
      copy(data)
      showNotification('Noice', 'Successfully copied to clipboard')
    }

    const changeQrCode = () => {
      if (this.state.qrCodeType === 1) {
        this.setState({ qrCodeType: 2 })
      } else {
        this.setState({ qrCodeType: 1 })
      }
    }
    
    const {
      isOpen,
      pubkey,
      address,
      newAddress,
      closeReceiveModal
    } = this.props

    const { qrCodeType } = this.state
    
    if (!isOpen) { return null }
    return (
      <div className={styles.container}>
        <div className={styles.closeContainer}>
          <span onClick={closeReceiveModal}>
            <Isvg src={x} />
          </span>
        </div>
        <header className={styles.header}>
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
    )
  }
}

ReceiveModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  pubkey: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  newAddress: PropTypes.func.isRequired
}

export default ReceiveModal
