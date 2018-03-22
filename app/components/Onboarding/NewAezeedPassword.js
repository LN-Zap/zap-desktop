import React from 'react'
import PropTypes from 'prop-types'
import styles from './NewAezeedPassword.scss'

const NewAezeedPassword = ({
  aezeedPassword,
  aezeedPasswordConfirmation,
  showAezeedPasswordConfirmationError,
  updateAezeedPassword,
  updateAezeedPasswordConfirmation
}) => (
  <div className={styles.container}>
    <section className={styles.input}>
      <input
        type='password'
        placeholder='Password'
        className={styles.password}
        value={aezeedPassword}
        onChange={event => updateAezeedPassword(event.target.value)}
      />
    </section>

    <section className={styles.input}>
      <input
        type='password'
        placeholder='Confirm Password'
        className={`${styles.password} ${showAezeedPasswordConfirmationError && styles.error}`}
        value={aezeedPasswordConfirmation}
        onChange={event => updateAezeedPasswordConfirmation(event.target.value)}
      />
      <p className={`${styles.errorMessage} ${showAezeedPasswordConfirmationError && styles.visible}`}>Passwords do not match</p>
    </section>
  </div>
)

NewAezeedPassword.propTypes = {
  aezeedPassword: PropTypes.string.isRequired,
  aezeedPasswordConfirmation: PropTypes.string.isRequired,
  showAezeedPasswordConfirmationError: PropTypes.bool.isRequired,
  updateAezeedPassword: PropTypes.func.isRequired,
  updateAezeedPasswordConfirmation: PropTypes.func.isRequired
}

export default NewAezeedPassword
