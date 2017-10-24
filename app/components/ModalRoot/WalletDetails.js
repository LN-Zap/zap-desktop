import React from 'react'
import PropTypes from 'prop-types'
import QRCode from 'qrcode.react'
import styles from './WalletDetails.scss'

const WalletDetails = ({ info, address }) => (
  <div className={styles.walletdetails}>
    <div className={styles.inner}>
      <div className={styles.left}>
        <section>
          <h4>Node Alias</h4>
          <h1>Testing</h1>
        </section>
        <section>
          <h4>Node Public Key</h4>
          <p className={styles.copytext}>{info.data.identity_pubkey}</p>
        </section>
        <section>
          <h4>Deposit Address</h4>
          <div className={styles.qrcode}>
            <QRCode value={address} />
          </div>
          <p className={styles.copytext}>{address}</p>
        </section>
      </div>
      <div className={styles.right}>
        <section>
          <h2>
              Network
          </h2>
        </section>
      </div>
    </div>
  </div>
)

WalletDetails.propTypes = {
  info: PropTypes.object.isRequired,
  address: PropTypes.string.isRequired
}

export default WalletDetails
