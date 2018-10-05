import React, { Component } from 'react'
import PropTypes from 'prop-types'
import QRCode from 'qrcode.react'
import copy from 'copy-to-clipboard'
import Isvg from 'react-inlinesvg'
import zapLogo from 'icons/zap-logo.svg'
import zapLogoDark from 'icons/zap-logo-black.svg'
import copyIcon from 'icons/copy.svg'
import { showNotification } from 'lib/utils/notifications'
import { FormattedMessage, injectIntl } from 'react-intl'
import messages from './messages'
import styles from './Syncing.scss'

class Syncing extends Component {
  state = {
    timer: null,
    syncMessageDetail: null,
    syncMessageExtraDetail: null
  }

  componentWillMount() {
    const { syncStatus, intl } = this.props

    // If we are still waiting for peers after some time, advise te user it could take a wile.
    let timer = setTimeout(() => {
      if (syncStatus === 'waiting') {
        this.setState({
          syncMessageDetail: intl.formatMessage({ ...messages.grab_coffee })
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
      lndCfilterHeight,
      intl,
      theme
    } = this.props
    let { syncMessageDetail, syncMessageExtraDetail } = this.state

    const copyClicked = () => {
      copy(address)
      showNotification('Noice', 'Successfully copied to clipboard')
    }
    let syncMessage
    if (syncStatus === 'waiting') {
      syncMessage = intl.formatMessage({ ...messages.waiting_for_peers })
    } else if (syncStatus === 'in-progress') {
      if (typeof syncPercentage === 'undefined' || syncPercentage <= 0) {
        syncMessage = intl.formatMessage({ ...messages.preparing })
        syncMessageDetail = null
      } else if (syncPercentage) {
        syncMessage = `${syncPercentage}%`
        syncMessageDetail = intl.formatMessage(
          { ...messages.block_progress },
          {
            currentBlock: lndBlockHeight.toLocaleString(),
            totalBlocks: blockHeight.toLocaleString()
          }
        )
        syncMessageExtraDetail = intl.formatMessage(
          { ...messages.filter_progress },
          {
            currentFilter: lndCfilterHeight.toLocaleString(),
            totalFilters: blockHeight.toLocaleString()
          }
        )
      }
    }

    if (typeof hasSynced === 'undefined') {
      return null
    }

    return (
      <div className={`${styles.container} ${theme}`}>
        <div className={styles.titleBar} />

        <div className={styles.content}>
          <header>
            <Isvg className={styles.bitcoinLogo} src={theme === 'light' ? zapLogoDark : zapLogo} />
          </header>

          {hasSynced === true && (
            <div className={styles.hasNotSynced}>
              <div className={styles.title}>
                <h1>
                  <FormattedMessage {...messages.sync_title} />
                </h1>
                <p>
                  <FormattedMessage {...messages.sync_description} />
                </p>
              </div>
            </div>
          )}

          {hasSynced === false && (
            <div className={styles.hasSynced}>
              <div className={styles.title}>
                <h1>
                  <FormattedMessage {...messages.fund_title} />
                </h1>
                <p>
                  <FormattedMessage {...messages.fund_description} />
                </p>
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
            <h3>
              <FormattedMessage {...messages.sync_caption} />
            </h3>
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
  theme: PropTypes.string.isRequired,
  hasSynced: PropTypes.bool,
  syncStatus: PropTypes.string.isRequired,
  syncPercentage: PropTypes.number,
  blockHeight: PropTypes.number,
  lndBlockHeight: PropTypes.number,
  lndCfilterHeight: PropTypes.number
}

export default injectIntl(Syncing)
