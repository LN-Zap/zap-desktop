import React from 'react'
import PropTypes from 'prop-types'
import styles from './NewAezeedPassword.scss'

class NewAezeedPassword extends React.Component {
  constructor(props) {
    super(props)
    this.state = { confirmPassword: '' }
  }

  render() {
    const { aezeedPassword, updateAezeedPassword } = this.props
    const { confirmPassword } = this.state

    return (
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
            className={styles.password}
            value={confirmPassword}
            onChange={event => this.setState({ confirmPassword: event.target.value })}
          />
        </section>
      </div>
    )
  }
}

NewAezeedPassword.propTypes = {
  aezeedPassword: PropTypes.string.isRequired,
  updateAezeedPassword: PropTypes.func.isRequired
}

export default NewAezeedPassword

