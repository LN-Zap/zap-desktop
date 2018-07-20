import React from 'react'
import PropTypes from 'prop-types'
import styles from './ConnectionDetails.scss'

const ConnectionDetails = ({
  connectionHost,
  connectionCert,
  connectionMacaroon,
  setConnectionHost,
  setConnectionCert,
  setConnectionMacaroon,
  startLndHostError,
  startLndCertError,
  startLndMacaroonError,
  setConnectionHostToSuggestedValue,
  setConnectionCertToSuggestedValue,
  setConnectionMacaroonToSuggestedValue
}) => (
  <div className={styles.container}>
    <section className={styles.input}>
      <label htmlFor="connectionHost">Host:</label>
      <input
        type="text"
        id="connectionHost"
        className={`${styles.host} ${startLndHostError && styles.error}`}
        ref={input => input}
        value={connectionHost}
        onChange={event => setConnectionHost(event.target.value)}
      />
      <div className={styles.messages}>
        <p className={styles.description}>
          Hostname and port of the Lnd gRPC interface. Example: localhost:10009
        </p>
        <div className={styles.reset} onClick={() => setConnectionHostToSuggestedValue()}>
          Use suggested value
        </div>
      </div>
      <div className={`${startLndHostError && styles.visible} ${styles.errorMessage}`}>
        {startLndHostError}
      </div>
    </section>
    <section className={styles.input}>
      <label htmlFor="connectionCert">TLS Certificate:</label>
      <input
        type="text"
        id="connectionCert"
        className={`${styles.cert} ${startLndCertError && styles.error}`}
        ref={input => input}
        value={connectionCert}
        onChange={event => setConnectionCert(event.target.value)}
      />
      <div className={styles.messages}>
        <p className={styles.description}>Path to the lnd tls cert. Example: /path/to/tls.cert</p>
        <div className={styles.reset} onClick={() => setConnectionCertToSuggestedValue()}>
          Use suggested value
        </div>
      </div>
      <div className={`${startLndCertError && styles.visible} ${styles.errorMessage}`}>
        {startLndCertError}
      </div>
    </section>
    <section className={styles.input}>
      <label htmlFor="connectionMacaroon">Macaroon:</label>
      <input
        type="text"
        id="connectionMacaroon"
        className={`${styles.macaroon} ${startLndMacaroonError && styles.error}`}
        ref={input => input}
        value={connectionMacaroon}
        onChange={event => setConnectionMacaroon(event.target.value)}
      />
      <div className={styles.messages}>
        <p className={styles.description}>
          Path to the lnd macaroon file. Example: /path/to/admin.macaroon
        </p>
        <div className={styles.reset} onClick={() => setConnectionMacaroonToSuggestedValue()}>
          Use suggested value
        </div>
      </div>
      <div className={`${startLndMacaroonError && styles.visible} ${styles.errorMessage}`}>
        {startLndMacaroonError}
      </div>
    </section>
  </div>
)

ConnectionDetails.propTypes = {
  connectionHost: PropTypes.string.isRequired,
  connectionCert: PropTypes.string.isRequired,
  connectionMacaroon: PropTypes.string.isRequired,
  setConnectionHost: PropTypes.func.isRequired,
  setConnectionCert: PropTypes.func.isRequired,
  setConnectionMacaroon: PropTypes.func.isRequired,
  startLndHostError: PropTypes.string,
  startLndCertError: PropTypes.string,
  startLndMacaroonError: PropTypes.string,
  setConnectionHostToSuggestedValue: PropTypes.func.isRequired,
  setConnectionCertToSuggestedValue: PropTypes.func.isRequired,
  setConnectionMacaroonToSuggestedValue: PropTypes.func.isRequired
}

export default ConnectionDetails
