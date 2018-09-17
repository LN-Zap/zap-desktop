import React from 'react'
import PropTypes from 'prop-types'
import FaCircle from 'react-icons/lib/fa/circle'
import FaCircleThin from 'react-icons/lib/fa/circle-thin'
import { FormattedMessage } from 'react-intl'
import messages from './messages'
import styles from './ConnectionType.scss'

const ConnectionType = ({ connectionType, setConnectionType }) => (
  <div className={styles.container}>
    <section
      className={`${styles.option} ${connectionType === 'local' ? styles.active : undefined}`}
    >
      <div className={`${styles.button}`} onClick={() => setConnectionType('local')}>
        {connectionType === 'local' ? <FaCircle /> : <FaCircleThin />}
        <span className={styles.label}>
          <FormattedMessage {...messages.default} />{' '}
          <span className={styles.superscript}>testnet</span>
        </span>
      </div>
      <div className={`${styles.description}`}>
        <FormattedMessage {...messages.default_description} />
        <br />
        (testnet <FormattedMessage {...messages.only} />)
      </div>
    </section>
    <section
      className={`${styles.option} ${connectionType === 'custom' ? styles.active : undefined}`}
    >
      <div className={`${styles.button}`} onClick={() => setConnectionType('custom')}>
        {connectionType === 'custom' ? <FaCircle /> : <FaCircleThin />}
        <span className={styles.label}>
          <FormattedMessage {...messages.custom} />
        </span>
      </div>
      <div className={`${styles.description}`}>
        <FormattedMessage {...messages.custom_description} />
      </div>
    </section>
    <section className={`${styles.option} ${connectionType === 'btcpayserver' && styles.active}`}>
      <div className={`${styles.button}`} onClick={() => setConnectionType('btcpayserver')}>
        {connectionType === 'btcpayserver' ? <FaCircle /> : <FaCircleThin />}
        <span className={styles.label}>BTCPay Server</span>
      </div>
      <div className={`${styles.description}`}>
        <FormattedMessage {...messages.btcpay_description} />
      </div>
    </section>
  </div>
)

ConnectionType.propTypes = {
  connectionType: PropTypes.string.isRequired,
  setConnectionType: PropTypes.func.isRequired
}

export default ConnectionType
