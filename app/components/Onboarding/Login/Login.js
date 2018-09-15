import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import messages from './messages'
import styles from './Login.scss'

const Login = ({
  password,
  updatePassword,
  unlockingWallet,
  unlockWallet,
  unlockWalletError,
  intl
}) => (
  <div className={styles.container}>
    <input
      type="password"
      placeholder={intl.formatMessage({ ...messages.password_placeholder })}
      className={`${styles.password} ${unlockWalletError.isError ? styles.inputError : undefined}`}
      ref={input => input && input.focus()}
      value={password}
      onChange={event => updatePassword(event.target.value)}
      onKeyPress={event => {
        if (event.key === 'Enter') {
          unlockWallet(password)
        }
      }}
    />
    <p className={`${unlockWalletError.isError ? styles.active : undefined} ${styles.error}`}>
      {unlockWalletError.message}
    </p>

    <section className={styles.buttons}>
      <div>
        <span
          className={`${!unlockingWallet ? styles.active : undefined} ${styles.button}`}
          onClick={() => unlockWallet(password)}
        >
          {unlockingWallet ? (
            <i className={styles.spinner} />
          ) : (
            <FormattedMessage {...messages.unlock} />
          )}
        </span>
      </div>
    </section>
  </div>
)

Login.propTypes = {
  password: PropTypes.string.isRequired,
  updatePassword: PropTypes.func.isRequired,
  unlockingWallet: PropTypes.bool.isRequired,
  unlockWallet: PropTypes.func.isRequired,
  unlockWalletError: PropTypes.object.isRequired
}

export default injectIntl(Login)
