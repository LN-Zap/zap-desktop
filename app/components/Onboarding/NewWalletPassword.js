import React from 'react'
import PropTypes from 'prop-types'
import styles from './NewWalletPassword.scss'

const NewWalletPassword = ({
  createWalletPassword,
  createWalletPasswordConfirmation,
  showCreateWalletPasswordConfirmationError,
  passwordMinChars,
  passwordMinCharsError,
  updateCreateWalletPassword,
  updateCreateWalletPasswordConfirmation
}) => (
  <div className={styles.container}>
    <section className={styles.input}>
      <input
        type="password"
        placeholder="Password"
        className={styles.password}
        value={createWalletPassword}
        onChange={event => updateCreateWalletPassword(event.target.value)}
      />
    </section>

    <section className={styles.input}>
      <input
        type='password'
        placeholder='Confirm Password'
        className={`${styles.password} ${showCreateWalletPasswordConfirmationError && styles.error} ${passwordMinCharsError && styles.error}`}
        value={createWalletPasswordConfirmation}
        onChange={event => updateCreateWalletPasswordConfirmation(event.target.value)}
      />
      <p className={`${styles.errorMessage} ${showCreateWalletPasswordConfirmationError && styles.visible}`}>Passwords do not match</p>
      <p className={`${styles.errorMessage} ${passwordMinCharsError && styles.visible}`}>Password is less than 8 characters</p>
      <p className={`${styles.helpMessage}`}>Password must be at least 8 characters long</p>
    </section>
  </div>
)

NewWalletPassword.propTypes = {
  createWalletPassword: PropTypes.string.isRequired,
  createWalletPasswordConfirmation: PropTypes.string.isRequired,
  showCreateWalletPasswordConfirmationError: PropTypes.bool.isRequired,
  passwordMinChars: PropTypes.bool.isRequired,
  passwordMinCharsError: PropTypes.bool.isRequired,
  updateCreateWalletPassword: PropTypes.func.isRequired,
  updateCreateWalletPasswordConfirmation: PropTypes.func.isRequired
}

export default NewWalletPassword
