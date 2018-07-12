import React, { Component } from 'react'
import PropTypes from 'prop-types'
import QRCode from 'qrcode.react'
import copy from 'copy-to-clipboard'
import Isvg from 'react-inlinesvg'
import zapLogo from 'icons/zap_logo.svg'
import { showNotification } from 'notifications'
import styles from './Syncing.scss'

class Syncing extends Component {
  componentWillMount() {}

  render() {
    const { hasSynced, syncPercentage, address, blockHeight, lndBlockHeight } = this.props

    const copyClicked = () => {
      copy(address)
      showNotification('Noice', 'Successfully copied to clipboard')
    }

    if (typeof hasSynced === 'undefined') {
      return null
    }

    return (
      <div className={styles.container}>
        <div className={styles.titleBar} />

        <div className={styles.content}>
          <header>
            <Isvg className={styles.bitcoinLogo} src={zapLogo} />
          </header>

          {hasSynced === true && (
            <div>
              <div className={styles.title}>
                <h1>Welcome back to your Zap wallet!</h1>
                <p>
                  Please wait a while whilst we fetch all of your latest data from the blockchain.
                </p>
              </div>
              <div className={styles.loading}>
                <div className={styles.spinner} />
              </div>
            </div>
          )}

          {hasSynced === false && (
            <div>
              <div className={styles.title}>
                <h1>Fund your Zap wallet</h1>
                <p>Might as well fund your wallet while you&apos;re waiting to sync.</p>
              </div>
              {address && address.length ? (
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
            </div>
          )}

          <section className={styles.progressContainer}>
            <h3>Syncing to the blockchain...</h3>
            <div className={styles.progressBar}>
              <div
                className={styles.progress}
                style={{ width: syncPercentage ? `${syncPercentage}%` : 0 }}
              />
            </div>
            <h4>
              {typeof syncPercentage === 'undefined' && 'Preparing...'}
              {Boolean(syncPercentage >= 0 && syncPercentage < 99) && `${syncPercentage}%`}
              {Boolean(syncPercentage >= 99) && 'Finalizing...'}
            </h4>
            {Boolean(syncPercentage >= 0 && syncPercentage < 99) && (
              <span className={styles.progressCounter}>
                {Boolean(!blockHeight || !lndBlockHeight) && 'starting...'}
                {Boolean(blockHeight && lndBlockHeight) &&
                  `${lndBlockHeight.toLocaleString()} of ${blockHeight.toLocaleString()}`}
              </span>
            )}
          </section>
        </div>
      </div>
    )
  }
}

Syncing.propTypes = {
  address: PropTypes.string.isRequired,
  hasSynced: PropTypes.bool,
  syncPercentage: PropTypes.number,
  blockHeight: PropTypes.number,
  lndBlockHeight: PropTypes.number
}

export default Syncing
