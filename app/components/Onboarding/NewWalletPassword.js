import React from 'react'
import PropTypes from 'prop-types'
import styles from './NewWalletPassword.scss'

const NewWalletPassword = ({
  createWalletPassword,
  createWalletPasswordConfirmation,
  showCreateWalletPasswordConfirmationError,
  updateCreateWalletPassword,
  updateCreateWalletPasswordConfirmation
}) => (
  <div className={styles.container}>
    <section className={styles.input}>
      <input
        type='password'
        placeholder='Password'
        className={styles.password}
        value={createWalletPassword}
        onChange={event => updateCreateWalletPassword(event.target.value)}
        autoFocus
      />
    </section>

    <section className={styles.input}>
      <input
        type='password'
        placeholder='Confirm Password'
        className={`${styles.password} ${showCreateWalletPasswordConfirmationError && styles.error}`}
        value={createWalletPasswordConfirmation}
        onChange={event => updateCreateWalletPasswordConfirmation(event.target.value)}
      />
      <p className={`${styles.errorMessage} ${showCreateWalletPasswordConfirmationError && styles.visible}`}>Passwords do not match</p>
    </section>
  </div>
)

NewWalletPassword.propTypes = {
  createWalletPassword: PropTypes.string.isRequired,
  createWalletPasswordConfirmation: PropTypes.string.isRequired,
  showCreateWalletPasswordConfirmationError: PropTypes.bool.isRequired,
  updateCreateWalletPassword: PropTypes.func.isRequired,
  updateCreateWalletPasswordConfirmation: PropTypes.func.isRequired
}

export default NewWalletPassword
