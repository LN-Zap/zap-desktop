import React from 'react'
import PropTypes from 'prop-types'

import { FormattedMessage } from 'react-intl'
import LoadingBolt from 'components/LoadingBolt'
import messages from './messages'

import FormContainer from './FormContainer'
import ConnectionType from './ConnectionType'
import ConnectionDetails from './ConnectionDetails'
import ConnectionConfirm from './ConnectionConfirm'
import BtcPayServer from './BtcPayServer'
import Alias from './Alias'
import Autopilot from './Autopilot'
import Login from './Login'
import Signup from './Signup'
import RecoverForm from './RecoverForm'
import NewWalletSeed from './NewWalletSeed'
import ReEnterSeed from './ReEnterSeed'
import NewWalletPassword from './NewWalletPassword'
import styles from './Onboarding.scss'

const Onboarding = ({
  onboarding: {
    step,
    previousStep,
    connectionType,
    connectionString,
    connectionHost,
    connectionCert,
    connectionMacaroon,
    alias,
    autopilot,
    startingLnd,
    createWalletPassword,
    seed,
    fetchingSeed
  },
  connectionTypeProps,
  connectionDetailProps,
  connectionConfirmProps,
  changeStep,
  startLnd,
  submitNewWallet,
  recoverOldWallet,
  aliasProps,
  initWalletProps,
  autopilotProps,
  recoverFormProps,
  newWalletSeedProps,
  newWalletPasswordProps,
  reEnterSeedProps
}) => {
  const renderStep = () => {
    switch (step) {
      case 0.1:
        return (
          <FormContainer
            title={<FormattedMessage {...messages.connection_title} />}
            description={<FormattedMessage {...messages.connection_description} />}
            back={null}
            next={() => {
              switch (connectionType) {
                case 'custom':
                  changeStep(0.2)
                  break
                case 'btcpayserver':
                  changeStep(0.3)
                  break
                default:
                  changeStep(1)
              }
            }}
          >
            <ConnectionType {...connectionTypeProps} />
          </FormContainer>
        )

      case 0.2:
        return (
          <FormContainer
            title={<FormattedMessage {...messages.connection_details_custom_title} />}
            description={<FormattedMessage {...messages.connection_details_custom_description} />}
            back={() => changeStep(0.1)}
            next={() => {
              // dont allow the user to move on if we don't at least have a hostname.
              if (!connectionDetailProps.connectionHostIsValid) {
                return
              }

              changeStep(0.4)
            }}
          >
            <ConnectionDetails {...connectionDetailProps} />
          </FormContainer>
        )

      case 0.3:
        return (
          <FormContainer
            title={<FormattedMessage {...messages.btcpay_title} />}
            description={<FormattedMessage {...messages.btcpay_description} />}
            back={() => changeStep(0.1)}
            next={() => {
              // dont allow the user to move on if the connection string is invalid.
              if (!connectionDetailProps.connectionStringIsValid) {
                return
              }

              changeStep(0.4)
            }}
          >
            <BtcPayServer {...connectionDetailProps} />
          </FormContainer>
        )

      case 0.4:
        return (
          <FormContainer
            title={<FormattedMessage {...messages.confirm_connection_title} />}
            description={<FormattedMessage {...messages.confirm_connection_description} />}
            back={() => changeStep(previousStep)}
            next={() => {
              startLnd({
                type: connectionType,
                string: connectionString,
                host: connectionHost,
                cert: connectionCert,
                macaroon: connectionMacaroon
              })
            }}
          >
            <ConnectionConfirm {...connectionConfirmProps} />
          </FormContainer>
        )

      case 1:
        return (
          <FormContainer
            title={<FormattedMessage {...messages.alias_title} />}
            description={<FormattedMessage {...messages.alias_description} />}
            back={() => changeStep(0.1)}
            next={() => changeStep(2)}
          >
            <Alias {...aliasProps} />
          </FormContainer>
        )
      case 2:
        return (
          <FormContainer
            title={<FormattedMessage {...messages.autopilot_title} />}
            description={<FormattedMessage {...messages.autopilot_description} />}
            back={() => changeStep(1)}
            next={() => startLnd({ type: connectionType, alias, autopilot })}
          >
            <Autopilot {...autopilotProps} />
          </FormContainer>
        )
      case 3:
        return (
          <FormContainer
            title={<FormattedMessage {...messages.login_title} />}
            description={
              <FormattedMessage
                {...messages.login_description}
                values={{
                  walletDir:
                    initWalletProps.loginProps.existingWalletDir && connectionType === 'local'
                      ? initWalletProps.loginProps.existingWalletDir
                      : connectionHost.split(':')[0]
                }}
              />
            }
            back={null}
            next={null}
          >
            <Login {...initWalletProps.loginProps} />
          </FormContainer>
        )
      case 4:
        return (
          <FormContainer
            title={<FormattedMessage {...messages.create_wallet_password_title} />}
            description={<FormattedMessage {...messages.create_wallet_password_description} />}
            back={null}
            next={() => {
              // dont allow the user to move on if the confirmation password doesnt match the original password
              // if the password is less than 8 characters or empty dont allow users to proceed
              if (
                newWalletPasswordProps.passwordMinCharsError ||
                !newWalletPasswordProps.createWalletPassword ||
                !newWalletPasswordProps.createWalletPasswordConfirmation ||
                newWalletPasswordProps.showCreateWalletPasswordConfirmationError
              ) {
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
            title={<FormattedMessage {...messages.signup_title} />}
            description={<FormattedMessage {...messages.signup_description} />}
            back={() => changeStep(4)}
            next={() => {
              // require the user to select create wallet or import wallet
              if (
                !initWalletProps.signupProps.signupForm.create &&
                !initWalletProps.signupProps.signupForm.import
              ) {
                return
              }

              changeStep(initWalletProps.signupProps.signupForm.create ? 6 : 5.1)
            }}
          >
            <Signup {...initWalletProps.signupProps} />
          </FormContainer>
        )
      case 5.1:
        return (
          <FormContainer
            title={<FormattedMessage {...messages.import_title} />}
            description={<FormattedMessage {...messages.import_description} />}
            back={() => changeStep(5)}
            next={() => {
              const recoverySeed = recoverFormProps.recoverSeedInput.map(input => input.word)

              recoverOldWallet(createWalletPassword, recoverySeed)
            }}
          >
            <RecoverForm {...recoverFormProps} />
          </FormContainer>
        )
      case 6:
        return (
          <FormContainer
            title={<FormattedMessage {...messages.save_seed_title} />}
            description={<FormattedMessage {...messages.save_seed_description} />}
            back={() => changeStep(5)}
            next={() => changeStep(7)}
          >
            <NewWalletSeed {...newWalletSeedProps} />
          </FormContainer>
        )
      case 7:
        return (
          <FormContainer
            title={<FormattedMessage {...messages.retype_seed_title} />}
            description={
              <FormattedMessage
                {...messages.retype_seed_description}
                values={{
                  word1: reEnterSeedProps.seedIndexesArr[0],
                  word2: reEnterSeedProps.seedIndexesArr[1],
                  word3: reEnterSeedProps.seedIndexesArr[2]
                }}
              />
            }
            back={() => changeStep(6)}
            next={() => {
              // don't allow them to move on if they havent re-entered the seed correctly
              if (!reEnterSeedProps.reEnterSeedChecker) {
                return
              }

              submitNewWallet(createWalletPassword, seed)
            }}
          >
            <ReEnterSeed {...reEnterSeedProps} />
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
  connectionConfirmProps: PropTypes.object.isRequired,
  aliasProps: PropTypes.object.isRequired,
  autopilotProps: PropTypes.object.isRequired,
  initWalletProps: PropTypes.object.isRequired,
  newWalletSeedProps: PropTypes.object.isRequired,
  newWalletPasswordProps: PropTypes.object.isRequired,
  recoverFormProps: PropTypes.object.isRequired,
  reEnterSeedProps: PropTypes.object.isRequired,
  changeStep: PropTypes.func.isRequired,
  startLnd: PropTypes.func.isRequired,
  submitNewWallet: PropTypes.func.isRequired,
  recoverOldWallet: PropTypes.func.isRequired
}

export default Onboarding
