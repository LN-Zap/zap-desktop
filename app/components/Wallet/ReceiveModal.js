import React from 'react'
import PropTypes from 'prop-types'
import copy from 'copy-to-clipboard'
import QRCode from 'qrcode.react'
import copyIcon from 'icons/copy.svg'
import Isvg from 'react-inlinesvg'

import x from 'icons/x.svg'
import { showNotification } from 'lib/utils/notifications'

import styles from './ReceiveModal.scss'

class ReceiveModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      qrCodeType: 1
    }
  }

  render() {
    const copyOnClick = data => {
      copy(data)
      showNotification('Noice', 'Successfully copied to clipboard')
    }

    const changeQrCode = () => {
      const { qrCodeType } = this.state
      if (qrCodeType === 1) {
        this.setState({ qrCodeType: 2 })
      } else {
        this.setState({ qrCodeType: 1 })
      }
    }

    const { isOpen, pubkey, address, alias, closeReceiveModal, network } = this.props

    const { qrCodeType } = this.state

    if (!isOpen) {
      return null
    }

    return (
      <div className={styles.container}>
        <div className={styles.closeContainer}>
          <span onClick={closeReceiveModal}>
            <Isvg src={x} />
          </span>
        </div>

        <div className={styles.content}>
          <section className={styles.left}>
            <header className={styles.header}>
              <h2>{alias && alias.length ? alias : pubkey.substring(0, 10)}</h2>

              <div className={styles.qrCodeOptions}>
                <div
                  className={qrCodeType === 1 ? styles.active : undefined}
                  onClick={changeQrCode}
                >
                  Node Pubkey
                </div>
                <div
                  className={qrCodeType === 2 ? styles.active : undefined}
                  onClick={changeQrCode}
                >
                  Bitcoin Address
                </div>
              </div>
            </header>

            <div className={styles.qrCodeContainer}>
              <QRCode
                value={qrCodeType === 1 ? pubkey : address}
                renderAs="svg"
                size={150}
                bgColor="white"
                fgColor="#252832"
                level="L"
                className={styles.qrcode}
              />
            </div>
          </section>
          <section className={styles.right}>
            <div className={styles.pubkey}>
              <h4>Node Public Key</h4>
              <p>
                <span className={styles.data}>{pubkey}</span>
                <span
                  onClick={() => copyOnClick(pubkey)}
                  className={`${styles.copy} hint--left`}
                  data-hint="Copy pubkey"
                >
                  <Isvg src={copyIcon} />
                </span>
              </p>
            </div>

            <div className={styles.address}>
              <h4>Bitcoin {network.name} Address</h4>
              <p>
                <span className={styles.data}>{address}</span>
                <span
                  onClick={() => copyOnClick(address)}
                  className={`${styles.copy} hint--left`}
                  data-hint="Copy address"
                >
                  <Isvg src={copyIcon} />
                </span>
              </p>
            </div>
          </section>
        </div>
      </div>
    )
  }
}

ReceiveModal.propTypes = {
  network: PropTypes.shape({
    name: PropTypes.string
  }).isRequired,
  isOpen: PropTypes.bool.isRequired,
  pubkey: PropTypes.string,
  address: PropTypes.string,
  alias: PropTypes.string,
  closeReceiveModal: PropTypes.func.isRequired
}

export default ReceiveModal
