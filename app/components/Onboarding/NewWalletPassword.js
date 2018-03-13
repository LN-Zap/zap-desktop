import React from 'react'
import PropTypes from 'prop-types'
import Isvg from 'react-inlinesvg'
import eye from 'icons/eye.svg'
import styles from './NewWalletPassword.scss'

class NewWalletPassword extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      inputType: 'password',
      confirmPassword: ''
    }
  }

  render() {
    const { createWalletPassword, updateCreateWalletPassword } = this.props
    const { inputType, confirmPassword } = this.state

    const toggleInputType = () => {
      const newInputType = inputType === 'password' ? 'text' : 'password'

      this.setState({ inputType: newInputType })
    }

    return (
      <div className={styles.container}>
        <section className={styles.input}>
          <input
            type={inputType}
            placeholder='Password'
            className={styles.password}
            value={createWalletPassword}
            onChange={event => updateCreateWalletPassword(event.target.value)}
          />
        </section>

        <section className={styles.input}>
          <input
            type={inputType}
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

NewWalletPassword.propTypes = {
  createWalletPassword: PropTypes.string.isRequired,
  updateCreateWalletPassword: PropTypes.func.isRequired
}

export default NewWalletPassword
