import React from 'react'
import PropTypes from 'prop-types'

import LoadingBolt from 'components/LoadingBolt'

import FormContainer from './FormContainer'
import Alias from './Alias'
import Autopilot from './Autopilot'
import InitWallet from './InitWallet'
import NewWalletSeed from './NewWalletSeed'
import NewWalletPassword from './NewWalletPassword'
import styles from './Onboarding.scss'

const Onboarding = ({
  onboarding: {
    step,
    alias,
    autopilot,
    startingLnd,
    createWalletPassword,
    seed
  },
  changeStep,
  startLnd,
  submitNewWallet,
  aliasProps,
  initWalletProps,
  autopilotProps,
  newWalletSeedProps,
  newWalletPasswordProps
}) => {
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <FormContainer
            title='What should we call you?'
            description='Set your nickname to help others connect with you on the Lightning Network'
            back={null}
            next={() => changeStep(2)}
          >
            <Alias {...aliasProps} />
          </FormContainer>
        )
      case 2:
        return (
          <FormContainer
            title='Autopilot'
            description='Autopilot is an automatic network manager. Instead of manually adding people to build your network to make payments, enable autopilot to automatically connect you to the Lightning Network using 60% of your balance.' // eslint-disable-line
            back={() => changeStep(1)}
            next={() => startLnd(alias, autopilot)}
          >
            <Autopilot {...autopilotProps} />
          </FormContainer>
        )
      case 3:
        return (
          <FormContainer
            title='Welcome!'
            description='Enter your wallet password or create a new wallet' // eslint-disable-line
            back={() => changeStep(2)}
            next={null}
          >
            <InitWallet {...initWalletProps} />
          </FormContainer>
        )
      case 4:
        return (
          <FormContainer
            title='Save your wallet seed'
            description='Please save these 24 words securely! This will allow you to recover your wallet in the future' // eslint-disable-line
            back={() => changeStep(3)}
            next={() => changeStep(5)}
          >
            <NewWalletSeed {...newWalletSeedProps} />
          </FormContainer>
        )
      case 5:
        return (
          <FormContainer
            title='Set your password'
            description='Choose a password to encrypt your wallet' // eslint-disable-line
            back={() => changeStep(4)}
            next={() => submitNewWallet(createWalletPassword, seed)}
          >
            <NewWalletPassword {...newWalletPasswordProps} />
          </FormContainer>
        )
      default:
        return <LoadingBolt />
    }
  }

  if (startingLnd) { return <LoadingBolt /> }

  return (
    <div className={styles.container}>
      {renderStep()}
    </div>
  )
}

Onboarding.propTypes = {
  onboarding: PropTypes.object.isRequired,
  aliasProps: PropTypes.object.isRequired,
  autopilotProps: PropTypes.object.isRequired,
  changeStep: PropTypes.func.isRequired,
  startLnd: PropTypes.func.isRequired
}

export default Onboarding
