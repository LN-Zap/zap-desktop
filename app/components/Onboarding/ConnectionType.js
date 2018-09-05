import React from 'react'
import PropTypes from 'prop-types'
import FaCircle from 'react-icons/lib/fa/circle'
import FaCircleThin from 'react-icons/lib/fa/circle-thin'
import styles from './ConnectionType.scss'

const ConnectionType = ({ connectionType, setConnectionType }) => (
  <div className={styles.container}>
    <section
      className={`${styles.option} ${connectionType === 'local' ? styles.active : undefined}`}
    >
      <div className={`${styles.button}`} onClick={() => setConnectionType('local')}>
        {connectionType === 'local' ? <FaCircle /> : <FaCircleThin />}
        <span className={styles.label}>
          Default <span className={styles.superscript}>testnet</span>
        </span>
      </div>
      <div className={`${styles.description}`}>
        By selecting the defualt mode we will do everything for you. Just click and go!
        <br />
        (testnet only)
      </div>
    </section>
    <section
      className={`${styles.option} ${connectionType === 'custom' ? styles.active : undefined}`}
    >
      <div className={`${styles.button}`} onClick={() => setConnectionType('custom')}>
        {connectionType === 'custom' ? <FaCircle /> : <FaCircleThin />}
        <span className={styles.label}>Custom</span>
      </div>
      <div className={`${styles.description}`}>
        Connect to your own node. You will need to provide your own connection settings so this is
        for advanced users only.
      </div>
    </section>
    <section className={`${styles.option} ${connectionType === 'btcpayserver' && styles.active}`}>
      <div className={`${styles.button}`} onClick={() => setConnectionType('btcpayserver')}>
        {connectionType === 'btcpayserver' ? <FaCircle /> : <FaCircleThin />}
        <span className={styles.label}>BTCPay Server</span>
      </div>
      <div className={`${styles.description}`}>
        Connect to your own BTCPay Server instance to access your BTCPay Server wallet.
      </div>
    </section>
  </div>
)

ConnectionType.propTypes = {
  connectionType: PropTypes.string.isRequired,
  setConnectionType: PropTypes.func.isRequired
}

export default ConnectionType
