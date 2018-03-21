import React from 'react'
import PropTypes from 'prop-types'

import LoadingBolt from 'components/LoadingBolt'

import FormContainer from './FormContainer'
import Alias from './Alias'
import Autopilot from './Autopilot'
import InitWallet from './InitWallet'
import Login from './Login'
import Signup from './Signup'
import NewWalletSeed from './NewWalletSeed'
import ReEnterSeed from './ReEnterSeed'
import NewWalletPassword from './NewWalletPassword'
import NewAezeedPassword from './NewAezeedPassword'
import styles from './Onboarding.scss'

const Onboarding = ({
  onboarding: {
    step,
    alias,
    autopilot,
    startingLnd,
    createWalletPassword,
    seed,
    aezeedPassword
  },
  changeStep,
  startLnd,
  submitNewWallet,
  aliasProps,
  initWalletProps,
  autopilotProps,
  newWalletSeedProps,
  newWalletPasswordProps,
  newAezeedPasswordProps,
  reEnterSeedProps
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
            title='Welcome back!'
            description='Enter your wallet password or create a new wallet' // eslint-disable-line
            back={null}
            next={null}
          >
            <Login {...initWalletProps.loginProps} />
          </FormContainer>
        )
      case 4:
        return (
          <FormContainer
            title='Welcome!'
            description='Looks like you are new here. Set a password to encrypt your wallet. This password will be needed to unlock Zap in the future' // eslint-disable-line
            back={null}
            next={() => changeStep(5)}
          >
            <NewWalletPassword {...newWalletPasswordProps} />
          </FormContainer>
        )
      case 5:
        return (
          <FormContainer
            title={'Alright, let\'s get set up'}
            description='Would you like to create a new wallet or import an existing one?' // eslint-disable-line
            back={() => changeStep(4)}
            next={() => initWalletProps.signupProps.signupForm.create ? changeStep(6) : console.log('import')}
          >
            <Signup {...initWalletProps.signupProps} />
          </FormContainer>
        )
      case 6:
        return (
          <FormContainer
            title='Save your wallet seed'
            description='Please save these 24 words securely! This will allow you to recover your wallet in the future' // eslint-disable-line
            back={() => changeStep(5)}
            next={() => changeStep(7)}
          >
            <NewWalletSeed {...newWalletSeedProps} />
          </FormContainer>
        )
      case 7:
        return (
          <FormContainer
            title='Re-enter your seed'
            description='Yeah I know, might be annoying, but just to be safe!' // eslint-disable-line
            back={() => changeStep(6)}
            next={() => changeStep(8)}
          >
            <ReEnterSeed {...reEnterSeedProps} />
          </FormContainer>
        )
      case 8:
        return (
          <FormContainer
            title='Encrypt your seed'
            description='Totally optional, but we encourage it. Set a password that will be used to encrypt your wallet seed' // eslint-disable-line
            back={() => changeStep(6)}
            next={() => submitNewWallet(createWalletPassword, seed, aezeedPassword)}
          >
            <NewAezeedPassword {...newAezeedPasswordProps} />
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
