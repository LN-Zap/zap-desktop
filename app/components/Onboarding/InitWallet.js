import React from 'react'
import PropTypes from 'prop-types'
import Login from './Login'
import Signup from './Signup'
import styles from './InitWallet.scss'

const InitWallet = ({ hasSeed, loginProps, signupProps }) => (
  <div className={styles.container}>
    {hasSeed ? <Login {...loginProps} /> : <Signup {...signupProps} />}
  </div>
)

InitWallet.propTypes = {
  hasSeed: PropTypes.bool.isRequired,
  loginProps: PropTypes.object.isRequired,
  signupProps: PropTypes.object.isRequired
}

export default InitWallet
