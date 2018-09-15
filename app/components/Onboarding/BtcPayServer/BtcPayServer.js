import React from 'react'
import PropTypes from 'prop-types'

import { FormattedMessage, injectIntl } from 'react-intl'
import messages from './messages'

import styles from './BtcPayServer.scss'

const BtcPayServer = ({
  connectionString,
  connectionStringIsValid,
  setConnectionString,
  startLndHostError,
  intl
}) => (
  <div className={styles.container}>
    <section className={styles.input}>
      <label htmlFor="connectionString">
        <FormattedMessage {...messages.connection_string_label} />:
      </label>
      <textarea
        type="text"
        id="connectionString"
        rows="10"
        placeholder={intl.formatMessage({ ...messages.connection_string_placeholder })}
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
        <FormattedMessage {...messages.btcpay_description} />
      </p>
      <p
        className={`${styles.errorMessage} ${
          connectionString && !connectionStringIsValid ? styles.visible : undefined
        }`}
      >
        <FormattedMessage {...messages.btcpay_error} />
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

export default injectIntl(BtcPayServer)
