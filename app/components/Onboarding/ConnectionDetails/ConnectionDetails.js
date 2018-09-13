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
  startLndMacaroonError
}) => (
  <div className={styles.container}>
    <section className={styles.input}>
      <label htmlFor="connectionHost">Host:</label>
      <input
        type="text"
        id="connectionHost"
        className={`${styles.host} ${startLndHostError ? styles.error : undefined}`}
        ref={input => input}
        value={connectionHost}
        onChange={event => setConnectionHost(event.target.value)}
      />
      <p className={styles.description}>
        Hostname and port of the Lnd gRPC interface. Example: localhost:10009
      </p>
      <p className={`${startLndHostError ? styles.visible : undefined} ${styles.errorMessage}`}>
        {startLndHostError}
      </p>
    </section>
    <section className={styles.input}>
      <label htmlFor="connectionCert">TLS Certificate:</label>
      <input
        type="text"
        id="connectionCert"
        className={`${styles.cert} ${startLndCertError ? styles.error : undefined}`}
        ref={input => input}
        value={connectionCert}
        onChange={event => setConnectionCert(event.target.value)}
      />
      <p className={styles.description}>Path to the lnd tls cert. Example: /path/to/tls.cert</p>
      <p className={`${startLndCertError ? styles.visible : undefined} ${styles.errorMessage}`}>
        {startLndCertError}
      </p>
    </section>
    <section className={styles.input}>
      <label htmlFor="connectionMacaroon">Macaroon:</label>
      <input
        type="text"
        id="connectionMacaroon"
        className={`${styles.macaroon} ${startLndMacaroonError ? styles.error : undefined}`}
        ref={input => input}
        value={connectionMacaroon}
        onChange={event => setConnectionMacaroon(event.target.value)}
      />
      <p className={styles.description}>
        Path to the lnd macaroon file. Example: /path/to/admin.macaroon
      </p>
      <p className={`${startLndMacaroonError ? styles.visible : undefined} ${styles.errorMessage}`}>
        {startLndMacaroonError}
      </p>
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
  startLndMacaroonError: PropTypes.string
}

export default ConnectionDetails
