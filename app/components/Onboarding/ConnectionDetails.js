import React from 'react'
import PropTypes from 'prop-types'
import styles from './ConnectionDetails.scss'

const ConnectionDetails = ({
  connectionHost,
  connectionCert,
  connectionMacaroon,
  setConnectionHost,
  setConnectionCert,
  setConnectionMacaroon
}) => (
  <div className={styles.container}>
    <div>
      <label htmlFor="connectionHost">Host:</label>
      <input
        type="text"
        id="connectionHost"
        placeholder="Hostname / Port of the Lnd gRPC interface"
        className={styles.host}
        ref={input => input}
        value={connectionHost}
        onChange={event => setConnectionHost(event.target.value)}
      />
    </div>
    <div>
      <label htmlFor="connectionCert">TLS Certificate:</label>
      <input
        type="text"
        id="connectionCert"
        placeholder="Path to the lnd tls cert"
        className={styles.cert}
        ref={input => input}
        value={connectionCert}
        onChange={event => setConnectionCert(event.target.value)}
      />
    </div>
    <div>
      <label htmlFor="connectionMacaroon">Macaroon:</label>
      <input
        type="text"
        id="connectionMacaroon"
        placeholder="Path to the lnd macaroon file"
        className={styles.macaroon}
        ref={input => input}
        value={connectionMacaroon}
        onChange={event => setConnectionMacaroon(event.target.value)}
      />
    </div>
  </div>
)

ConnectionDetails.propTypes = {
  connectionHost: PropTypes.string.isRequired,
  connectionCert: PropTypes.string.isRequired,
  connectionMacaroon: PropTypes.string.isRequired,
  setConnectionHost: PropTypes.func.isRequired,
  setConnectionCert: PropTypes.func.isRequired,
  setConnectionMacaroon: PropTypes.func.isRequired
}

export default ConnectionDetails
