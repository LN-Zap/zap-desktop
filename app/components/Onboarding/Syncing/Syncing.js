import React, { Component } from 'react'
import PropTypes from 'prop-types'
import QRCode from 'qrcode.react'
import copy from 'copy-to-clipboard'
import Isvg from 'react-inlinesvg'
import zapLogo from 'icons/zap_logo.svg'
import copyIcon from 'icons/copy.svg'
import { showNotification } from 'lib/utils/notifications'
import styles from './Syncing.scss'

class Syncing extends Component {
  state = {
    timer: null,
    syncMessageDetail: null,
    syncMessageExtraDetail: null
  }

  componentWillMount() {
    const { syncStatus } = this.props

    // If we are still waiting for peers after some time, advise te user it could take a wile.
    let timer = setTimeout(() => {
      if (syncStatus === 'waiting') {
        this.setState({
          syncMessageDetail:
            'It looks like this could take some time - you might want to grab a coffee or try again later!'
        })
      }
    }, 10000)

    this.setState({ timer })
  }

  componentWillUnmount() {
    const { timer } = this.state
    clearInterval(timer)
  }

  render() {
    const {
      hasSynced,
      syncStatus,
      syncPercentage,
      address,
      blockHeight,
      lndBlockHeight,
      lndCfilterHeight
    } = this.props
    let { syncMessageDetail, syncMessageExtraDetail } = this.state

    const copyClicked = () => {
      copy(address)
      showNotification('Noice', 'Successfully copied to clipboard')
    }
    let syncMessage
    if (syncStatus === 'waiting') {
      syncMessage = 'Waiting for peers...'
    } else if (syncStatus === 'in-progress') {
      if (typeof syncPercentage === 'undefined' || syncPercentage <= 0) {
        syncMessage = 'Preparing...'
        syncMessageDetail = null
      } else if (syncPercentage) {
        syncMessage = `${syncPercentage}%`
        syncMessageDetail = `Block:
          ${lndBlockHeight.toLocaleString()} of ${blockHeight.toLocaleString()}`
        syncMessageExtraDetail = `Commitment Filter:
          ${lndCfilterHeight.toLocaleString()} of ${blockHeight.toLocaleString()}`
      }
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
                      bgColor="white"
                      fgColor="#252832"
                      level="L"
                      className={styles.qrcode}
                    />
                  </div>
                  <section className={styles.textAddress}>
                    <span className={styles.text}>{address}</span>
                    <span className={styles.icon} onClick={copyClicked}>
                      <Isvg src={copyIcon} />
                    </span>
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
            <h3>Syncing to the blockchain</h3>
            <div className={styles.progressBar}>
              <div
                className={styles.progress}
                style={{ width: syncPercentage ? `${syncPercentage}%` : 0 }}
              />
            </div>
            <h4>{syncMessage}</h4>
            {syncMessageDetail && (
              <span className={styles.progressDetail}>{syncMessageDetail}</span>
            )}
            {syncMessageExtraDetail && (
              <span className={styles.progressDetail}>
                <br />
                {syncMessageExtraDetail}
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
  syncStatus: PropTypes.string.isRequired,
  syncPercentage: PropTypes.number,
  blockHeight: PropTypes.number,
  lndBlockHeight: PropTypes.number,
  lndCfilterHeight: PropTypes.number
}

export default Syncing
