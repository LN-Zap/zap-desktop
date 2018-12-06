import React from 'react'
import PropTypes from 'prop-types'
import copy from 'copy-to-clipboard'
import QRCode from 'qrcode.react'
import Copy from 'components/Icon/Copy'
import { showNotification } from 'lib/utils/notifications'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Modal } from 'components/UI'
import messages from './messages'

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

    const { isOpen, pubkey, address, alias, closeReceiveModal, network, intl } = this.props

    const { qrCodeType } = this.state

    if (!isOpen) {
      return null
    }

    return (
      <Modal onClose={closeReceiveModal}>
        <div className={styles.container}>
          <div className={styles.content}>
            <section className={styles.left}>
              <header className={styles.header}>
                <h2>{alias && alias.length ? alias : pubkey.substring(0, 10)}</h2>

                <div className={styles.qrCodeOptions}>
                  <div
                    className={qrCodeType === 1 ? styles.active : undefined}
                    onClick={changeQrCode}
                  >
                    <FormattedMessage {...messages.node_pubkey} />
                  </div>
                  <div
                    className={qrCodeType === 2 ? styles.active : undefined}
                    onClick={changeQrCode}
                  >
                    <FormattedMessage {...messages.bitcoin_address} />
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
                <h4>
                  <FormattedMessage {...messages.node_public_key} />
                </h4>
                <p>
                  <span className={styles.data}>{pubkey}</span>
                  <span
                    onClick={() => copyOnClick(pubkey)}
                    className={`${styles.copy} hint--left`}
                    data-hint={intl.formatMessage({ ...messages.copy_pubkey })}
                  >
                    <Copy />
                  </span>
                </p>
              </div>

              <div className={styles.address}>
                <h4>
                  <FormattedMessage {...messages.bitcoin_address} />{' '}
                  {network && network.name.toLowerCase() === 'testnet' && network.name}
                </h4>
                <p>
                  <span className={styles.data}>{address}</span>
                  <span
                    onClick={() => copyOnClick(address)}
                    className={`${styles.copy} hint--left`}
                    data-hint={intl.formatMessage({ ...messages.copy_address })}
                  >
                    <Copy />
                  </span>
                </p>
              </div>
            </section>
          </div>
        </div>
      </Modal>
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

export default injectIntl(ReceiveModal)
