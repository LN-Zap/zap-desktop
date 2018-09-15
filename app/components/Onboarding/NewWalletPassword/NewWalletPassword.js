import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import messages from './messages'
import styles from './NewWalletPassword.scss'

const NewWalletPassword = ({
  createWalletPassword,
  createWalletPasswordConfirmation,
  showCreateWalletPasswordConfirmationError,
  passwordMinCharsError,
  updateCreateWalletPassword,
  updateCreateWalletPasswordConfirmation,
  intl
}) => (
  <div className={styles.container}>
    <section className={styles.input}>
      <input
        type="password"
        placeholder={intl.formatMessage({ ...messages.password_placeholder })}
        className={`${styles.password} ${
          showCreateWalletPasswordConfirmationError ? styles.error : undefined
        }
        ${passwordMinCharsError && styles.error}`}
        value={createWalletPassword}
        onChange={event => updateCreateWalletPassword(event.target.value)}
      />
    </section>

    <section className={styles.input}>
      <input
        type="password"
        placeholder={intl.formatMessage({ ...messages.password_confirm_placeholder })}
        className={`${styles.password} ${
          showCreateWalletPasswordConfirmationError ? styles.error : undefined
        }
        ${passwordMinCharsError && styles.error}`}
        value={createWalletPasswordConfirmation}
        onChange={event => updateCreateWalletPasswordConfirmation(event.target.value)}
      />
      <p
        className={`${styles.errorMessage} ${
          showCreateWalletPasswordConfirmationError ? styles.visible : undefined
        }`}
      >
        <FormattedMessage {...messages.password_error_match} />
      </p>
      <p className={`${styles.helpMessage} ${passwordMinCharsError ? styles.red : undefined}`}>
        <FormattedMessage
          {...messages.password_error_length}
          values={{
            passwordMinLength: '8'
          }}
        />
      </p>
    </section>
  </div>
)

NewWalletPassword.propTypes = {
  createWalletPassword: PropTypes.string.isRequired,
  createWalletPasswordConfirmation: PropTypes.string.isRequired,
  showCreateWalletPasswordConfirmationError: PropTypes.bool.isRequired,
  passwordMinCharsError: PropTypes.bool.isRequired,
  updateCreateWalletPassword: PropTypes.func.isRequired,
  updateCreateWalletPasswordConfirmation: PropTypes.func.isRequired
}

export default injectIntl(NewWalletPassword)
