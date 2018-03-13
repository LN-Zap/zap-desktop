import React from 'react'
import PropTypes from 'prop-types'
import Login from './Login'
import Signup from './Signup'
import styles from './InitWallet.scss'

const InitWallet = ({
  password,
  passwordIsValid,
  hasSeed,
  updatePassword,
  createWallet,
  unlockWallet,
  unlockingWallet,
  unlockWalletError
}) => (
  <div className={styles.container}>
    {
      hasSeed ?
        <Login
          password={password}
          updatePassword={updatePassword}
          unlockingWallet={unlockingWallet}
          unlockWallet={unlockWallet}
          unlockWalletError={unlockWalletError}
        />
        :
        <Signup />
    }
  </div>
)

InitWallet.propTypes = {}

export default InitWallet
