import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Button } from 'components/UI'
import messages from './messages'
import styles from './Login.scss'

const Login = ({
  password,
  passwordIsValid,
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
      <Button
        disabled={!passwordIsValid || unlockingWallet}
        onClick={() => unlockWallet(password)}
        processing={unlockingWallet}
        size="large"
      >
        {unlockingWallet ? (
          <FormattedMessage {...messages.unlocking} />
        ) : (
          <FormattedMessage {...messages.unlock} />
        )}
      </Button>
    </section>
  </div>
)

Login.propTypes = {
  password: PropTypes.string.isRequired,
  passwordIsValid: PropTypes.bool.isRequired,
  updatePassword: PropTypes.func.isRequired,
  unlockingWallet: PropTypes.bool.isRequired,
  unlockWallet: PropTypes.func.isRequired,
  unlockWalletError: PropTypes.object.isRequired
}

export default injectIntl(Login)
