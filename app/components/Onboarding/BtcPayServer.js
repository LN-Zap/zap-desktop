import React from 'react'
import PropTypes from 'prop-types'
import styles from './BtcPayServer.scss'

const BtcPayServer = ({
  connectionString,
  connectionStringIsValid,
  setConnectionString,
  startLndHostError
}) => (
  <div className={styles.container}>
    <section className={styles.input}>
      <label htmlFor="connectionString">Connection String:</label>
      <textarea
        type="text"
        id="connectionString"
        rows="10"
        placeholder="BTCPay Server Connection String"
        className={
          connectionString && (startLndHostError || !connectionStringIsValid)
            ? styles.error
            : undefined
        }
        ref={input => input}
        value={connectionString}
        onChange={event => setConnectionString(event.target.value)}
      />
      <p className={styles.description}>
        Paste the full content of your BTCPay Server connection config file. This can be found by
        clicking the link entitled &quot;Click here to open the configuration file.&quot; in your
        BTCPay Server gRPC settings.
      </p>
      <p
        className={`${styles.errorMessage} ${
          connectionString && !connectionStringIsValid ? styles.visible : undefined
        }`}
      >
        Invalid connection string.
      </p>
      <p
        className={`${styles.errorMessage} ${
          connectionString && startLndHostError ? styles.visible : undefined
        }`}
      >
        {startLndHostError}
      </p>
    </section>
  </div>
)

BtcPayServer.propTypes = {
  connectionString: PropTypes.string.isRequired,
  connectionStringIsValid: PropTypes.bool.isRequired,
  setConnectionString: PropTypes.func.isRequired,
  startLndHostError: PropTypes.string
}

export default BtcPayServer
