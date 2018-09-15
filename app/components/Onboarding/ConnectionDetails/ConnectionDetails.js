import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import messages from './messages'
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
      <label htmlFor="connectionHost">
        <FormattedMessage {...messages.hostname_title} />:
      </label>
      <input
        type="text"
        id="connectionHost"
        className={`${styles.host} ${startLndHostError ? styles.error : undefined}`}
        ref={input => input}
        value={connectionHost}
        onChange={event => setConnectionHost(event.target.value)}
      />
      <p className={styles.description}>
        <FormattedMessage {...messages.hostname_description} />
      </p>
      <p className={`${startLndHostError ? styles.visible : undefined} ${styles.errorMessage}`}>
        {startLndHostError}
      </p>
    </section>
    <section className={styles.input}>
      <label htmlFor="connectionCert">
        <FormattedMessage {...messages.cert_title} />:
      </label>
      <input
        type="text"
        id="connectionCert"
        className={`${styles.cert} ${startLndCertError ? styles.error : undefined}`}
        ref={input => input}
        value={connectionCert}
        onChange={event => setConnectionCert(event.target.value)}
      />
      <p className={styles.description}>
        <FormattedMessage {...messages.cert_description} />
      </p>
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
        <FormattedMessage {...messages.macaroon_description} />
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
