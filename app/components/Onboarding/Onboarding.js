import React from 'react'
import PropTypes from 'prop-types'

import LoadingBolt from 'components/LoadingBolt'

import FormContainer from './FormContainer'
import ConnectionType from './ConnectionType'
import ConnectionDetails from './ConnectionDetails'
import Alias from './Alias'
import Autopilot from './Autopilot'
import Login from './Login'
import Signup from './Signup'
import RecoverForm from './RecoverForm'
import NewWalletSeed from './NewWalletSeed'
import ReEnterSeed from './ReEnterSeed'
import NewWalletPassword from './NewWalletPassword'
import NewAezeedPassword from './NewAezeedPassword'
import styles from './Onboarding.scss'

const Onboarding = ({
  onboarding: {
    step,
    connectionType,
    connectionHost,
    connectionCert,
    connectionMacaroon,
    alias,
    autopilot,
    startingLnd,
    createWalletPassword,
    seed,
    aezeedPassword,
    fetchingSeed
  },
  connectionTypeProps,
  connectionDetailProps,
  changeStep,
  startLnd,
  submitNewWallet,
  aliasProps,
  initWalletProps,
  autopilotProps,
  recoverFormProps,
  newWalletSeedProps,
  newWalletPasswordProps,
  newAezeedPasswordProps,
  reEnterSeedProps
}) => {
  const renderStep = () => {
    switch (step) {
      case 0.1:
        return (
          <FormContainer
            title="How do you want to connect to the Lightning Network?"
            description="
              By default Zap will spin up a node for you and handle all the nerdy stuff
              in the background. However you can also setup a custom node connection and
              use Zap to control a remote node if you desire (for advanced users).
            "
            back={null}
            next={() => changeStep(connectionType === 'local' ? 1 : 0.2)}
          >
            <ConnectionType {...connectionTypeProps} />
          </FormContainer>
        )

      case 0.2:
        return (
          <FormContainer
            title="Connection details"
            description="Enter the connection details for your Lightning node."
            back={() => changeStep(0.1)}
            next={() =>
              startLnd({
                connectionType,
                connectionHost,
                connectionCert,
                connectionMacaroon
              })
            }
          >
            <ConnectionDetails {...connectionDetailProps} />
          </FormContainer>
        )

      case 1:
        return (
          <FormContainer
            title="What should we call you?"
            description="Set your nickname to help others connect with you on the Lightning Network"
            back={() => changeStep(0.1)}
            next={() => changeStep(2)}
          >
            <Alias {...aliasProps} />
          </FormContainer>
        )
      case 2:
        return (
          <FormContainer
            title="Autopilot"
            description="Autopilot is an automatic network manager. Instead of manually adding people to build your network to make payments, enable autopilot to automatically connect you to the Lightning Network using 60% of your balance." // eslint-disable-line max-len
            back={() => changeStep(1)}
            next={() => startLnd({ connectionType, alias, autopilot })}
          >
            <Autopilot {...autopilotProps} />
          </FormContainer>
        )
      case 3:
        return (
          <FormContainer
            title="Welcome back!"
            description="Enter your wallet password or create a new wallet"
            back={null}
            next={null}
          >
            <Login {...initWalletProps.loginProps} />
          </FormContainer>
        )
      case 4:
        return (
          <FormContainer
            title="Welcome!"
            description="Looks like you are new here. Set a password to encrypt your wallet. This password will be needed to unlock Zap in the future" // eslint-disable-line max-len
            back={null}
            next={() => {
              // dont allow the user to move on if the confirmation password doesnt match the original password
              if (newWalletPasswordProps.showCreateWalletPasswordConfirmationError) {
                return
              }
              // if the password is less than 8 characters dont allow users to proceed
              if (newWalletPasswordProps.passwordMinCharsError) {
                return
              }

              changeStep(5)
            }}
          >
            <NewWalletPassword {...newWalletPasswordProps} />
          </FormContainer>
        )
      case 5:
        return (
          <FormContainer
            title={"Alright, let's get set up"}
            description="Would you like to create a new wallet or import an existing one?"
            back={() => changeStep(4)}
            next={() => changeStep(initWalletProps.signupProps.signupForm.create ? 6 : 5.1)}
          >
            <Signup {...initWalletProps.signupProps} />
          </FormContainer>
        )
      case 5.1:
        return (
          <FormContainer
            title="Import your seed"
            description="Recovering a wallet, nice. You don't need anyone else, you got yourself :)"
            back={() => changeStep(5)}
            next={() => changeStep(5.2)}
          >
            <RecoverForm {...recoverFormProps} />
          </FormContainer>
        )
      case 5.2:
        return (
          <FormContainer
            title="Seed passphrase"
            description="Enter your cipherseed passphrase (or just submit if you don't have one)"
            back={() => changeStep(5)}
            next={() => {
              const recoverySeed = recoverFormProps.recoverSeedInput.map(input => input.word)

              submitNewWallet(createWalletPassword, recoverySeed, aezeedPassword)
            }}
          >
            <NewAezeedPassword {...newAezeedPasswordProps} />
          </FormContainer>
        )
      case 6:
        return (
          <FormContainer
            title="Save your wallet seed"
            description="Please save these 24 words securely! This will allow you to recover your wallet in the future"
            back={() => changeStep(5)}
            next={() => changeStep(7)}
          >
            <NewWalletSeed {...newWalletSeedProps} />
          </FormContainer>
        )
      case 7:
        return (
          <FormContainer
            title="Retype your seed"
            description={`Your seed is important! If you lose your seed you'll have no way to recover your wallet.
            To make sure that you have properly saved your seed, please retype words ${
              reEnterSeedProps.seedIndexesArr[0]
            }, ${reEnterSeedProps.seedIndexesArr[1]} and ${reEnterSeedProps.seedIndexesArr[2]}`}
            back={() => changeStep(6)}
            next={() => {
              // don't allow them to move on if they havent re-entered the seed correctly
              if (!reEnterSeedProps.reEnterSeedChecker) {
                return
              }

              changeStep(8)
            }}
          >
            <ReEnterSeed {...reEnterSeedProps} />
          </FormContainer>
        )
      case 8:
        return (
          <FormContainer
            title="Encrypt your seed"
            description="Totally optional, but we encourage it. Set a password that will be used to encrypt your wallet seed" // eslint-disable-line max-len
            back={() => changeStep(6)}
            next={() => {
              // dont allow the user to move on if the confirmation password doesnt match the original password
              if (newAezeedPasswordProps.showAezeedPasswordConfirmationError) {
                return
              }

              submitNewWallet(createWalletPassword, seed, aezeedPassword)
            }}
          >
            <NewAezeedPassword {...newAezeedPasswordProps} />
          </FormContainer>
        )
      default:
        return <LoadingBolt />
    }
  }

  if (startingLnd) {
    return <LoadingBolt />
  }
  if (fetchingSeed) {
    return <LoadingBolt />
  }

  return <div className={styles.container}>{renderStep()}</div>
}

Onboarding.propTypes = {
  onboarding: PropTypes.object.isRequired,
  connectionTypeProps: PropTypes.object.isRequired,
  connectionDetailProps: PropTypes.object.isRequired,
  aliasProps: PropTypes.object.isRequired,
  autopilotProps: PropTypes.object.isRequired,
  initWalletProps: PropTypes.object.isRequired,
  newWalletSeedProps: PropTypes.object.isRequired,
  newWalletPasswordProps: PropTypes.object.isRequired,
  newAezeedPasswordProps: PropTypes.object.isRequired,
  recoverFormProps: PropTypes.object.isRequired,
  reEnterSeedProps: PropTypes.object.isRequired,
  changeStep: PropTypes.func.isRequired,
  startLnd: PropTypes.func.isRequired,
  submitNewWallet: PropTypes.func.isRequired
}

export default Onboarding
