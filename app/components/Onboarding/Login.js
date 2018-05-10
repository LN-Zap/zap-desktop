import React from 'react'
import PropTypes from 'prop-types'
import styles from './Login.scss'

const Login = ({
  password,
  updatePassword,
  unlockingWallet,
  unlockWallet,
  unlockWalletError
}) => (
  <div className={styles.container}>
    <input
      type='password'
      placeholder='Password'
      className={`${styles.password} ${unlockWalletError.isError && styles.inputError}`}
      autoFocus
      value={password}
      onChange={event => updatePassword(event.target.value)}
    />
    <p className={`${unlockWalletError.isError && styles.active} ${styles.error}`}>
      {unlockWalletError.message}
    </p>

    <section className={styles.buttons}>
      <div>
        <span className={`${!unlockingWallet && styles.active} ${styles.button}`} onClick={() => unlockWallet(password)}>
          {
            unlockingWallet ?
              <i className={styles.spinner} />
              :
              'Log In'
          }
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

export default Login
