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
        placeholder="Hostname / Port of the Lnd gRPC interface"
        className={`${styles.host} ${startLndHostError && styles.error}`}
        ref={input => input}
        value={connectionHost}
        onChange={event => setConnectionHost(event.target.value)}
      />
      <p className={`${startLndHostError && styles.visible} ${styles.errorMessage}`}>
        {startLndHostError}
      </p>
    </section>
    <section className={styles.input}>
      <label htmlFor="connectionCert">TLS Certificate:</label>
      <input
        type="text"
        id="connectionCert"
        placeholder="Path to the lnd tls cert"
        className={`${styles.cert} ${startLndCertError && styles.error}`}
        ref={input => input}
        value={connectionCert}
        onChange={event => setConnectionCert(event.target.value)}
      />
      <p className={`${startLndCertError && styles.visible} ${styles.errorMessage}`}>
        {startLndCertError}
      </p>
    </section>
    <section className={styles.input}>
      <label htmlFor="connectionMacaroon">Macaroon:</label>
      <input
        type="text"
        id="connectionMacaroon"
        placeholder="Path to the lnd macaroon file"
        className={`${styles.macaroon} ${startLndMacaroonError && styles.error}`}
        ref={input => input}
        value={connectionMacaroon}
        onChange={event => setConnectionMacaroon(event.target.value)}
      />
      <p className={`${startLndMacaroonError && styles.visible} ${styles.errorMessage}`}>
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
