import React, { Component } from 'react'
import PropTypes from 'prop-types'
import QRCode from 'qrcode.react'
import copy from 'copy-to-clipboard'
import Isvg from 'react-inlinesvg'
import zapLogo from 'icons/zap_logo.svg'
import { showNotification } from 'notifications'
import styles from './Syncing.scss'

class Syncing extends Component {
  componentWillMount() {
    const { fetchBlockHeight, newAddress } = this.props

    fetchBlockHeight()
    newAddress('np2wkh')
  }

  render() {
    const { syncPercentage, address } = this.props

    const copyClicked = () => {
      copy(address)
      showNotification('Noice', 'Successfully copied to clipboard')
    }

    return (
      <div className={styles.container}>
        <div className={styles.titleBar} />

        <div className={styles.content}>
          <header>
            <Isvg className={styles.bitcoinLogo} src={zapLogo} />
          </header>

          <div className={styles.title}>
            <h1>Fund your Zap wallet</h1>
            <p>Might as well fund your wallet while you&apos;re waiting to sync.</p>
          </div>

          {address.length ? (
            <div className={styles.address}>
              <div className={styles.qrConatiner}>
                <QRCode
                  value={address}
                  renderAs="svg"
                  size={100}
                  bgColor="transparent"
                  fgColor="white"
                  level="L"
                  className={styles.qrcode}
                />
              </div>
              <section className={styles.textAddress}>
                <span>{address}</span>
                <span onClick={copyClicked}>copy</span>
              </section>
            </div>
          ) : (
            <div className={styles.loading}>
              <div className={styles.spinner} />
            </div>
          )}

          <section className={styles.progressContainer}>
            <h3>Syncing to the blockchain...</h3>
            <div className={styles.progressBar}>
              <div
                className={styles.progress}
                style={{ width: Number.isNaN(syncPercentage) ? 0 : `${syncPercentage}%` }}
              />
            </div>
            <h4>
              {Number.isNaN(parseInt(syncPercentage, 10)) || syncPercentage.toString().length === 0
                ? ''
                : `${syncPercentage}%`}
            </h4>
          </section>
        </div>
      </div>
    )
  }
}

Syncing.propTypes = {
  fetchBlockHeight: PropTypes.func.isRequired,
  newAddress: PropTypes.func.isRequired,
  address: PropTypes.string.isRequired,
  syncPercentage: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired
}

export default Syncing
