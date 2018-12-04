import React from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { Flex, Box } from 'rebass'
import { Panel, Wizard } from 'components/UI'
import {
  Autopilot,
  BtcPayServer,
  ConnectionType,
  ConnectionDetails,
  ConnectionConfirm,
  Login,
  Name,
  Password,
  Recover,
  SeedConfirm,
  SeedView,
  WalletCreate,
  WalletRecover
} from './Steps'
import messages from './messages'

class Onboarding extends React.Component {
  static propTypes = {
    // STATE
    autopilot: PropTypes.bool,
    name: PropTypes.string,
    connectionType: PropTypes.string,
    connectionHost: PropTypes.string,
    connectionCert: PropTypes.string,
    connectionMacaroon: PropTypes.string,
    connectionString: PropTypes.string,
    lightningGrpcActive: PropTypes.bool,
    walletUnlockerGrpcActive: PropTypes.bool,
    seed: PropTypes.array,
    startLndHostError: PropTypes.string,
    startLndCertError: PropTypes.string,
    startLndMacaroonError: PropTypes.string,
    onboarded: PropTypes.bool,
    fetchingSeed: PropTypes.bool,
    // DISPATCH
    createNewWallet: PropTypes.func.isRequired,
    fetchSeed: PropTypes.func.isRequired,
    recoverOldWallet: PropTypes.func.isRequired,
    resetOnboarding: PropTypes.func.isRequired,
    setAutopilot: PropTypes.func.isRequired,
    setConnectionType: PropTypes.func.isRequired,
    setConnectionHost: PropTypes.func.isRequired,
    setConnectionCert: PropTypes.func.isRequired,
    setConnectionMacaroon: PropTypes.func.isRequired,
    setConnectionString: PropTypes.func.isRequired,
    setName: PropTypes.func.isRequired,
    setPassword: PropTypes.func.isRequired,
    startLnd: PropTypes.func.isRequired,
    stopLnd: PropTypes.func.isRequired
  }

  componentWillUnmount() {
    const { resetOnboarding } = this.props
    resetOnboarding()
  }

  /**
   * Dynamically generte form steps to use in the onboarding Wizzard.
   * @return {[Wizzard.Step]} A list of WizardSteps.
   */
  getSteps = () => {
    const {
      // STATE
      autopilot,
      name,
      connectionType,
      connectionHost,
      connectionCert,
      connectionMacaroon,
      connectionString,
      lightningGrpcActive,
      walletUnlockerGrpcActive,
      seed,
      startLndHostError,
      startLndCertError,
      startLndMacaroonError,
      unlockWalletError,
      fetchingSeed,
      // DISPATCH
      setAutopilot,
      setConnectionType,
      setConnectionHost,
      setConnectionCert,
      setConnectionMacaroon,
      setConnectionString,
      setName,
      setUnlockWalletError,
      setPassword,
      startLnd,
      validateHost,
      validateCert,
      validateMacaroon,
      fetchSeed,
      resetOnboarding,
      createNewWallet,
      recoverOldWallet,
      stopLnd,
      unlockWallet
    } = this.props

    let formSteps = []
    switch (connectionType) {
      /**
       * Form steps for create flow.
       */
      case 'create':
        formSteps = [
          ...formSteps,
          <Wizard.Step
            key="SeedView"
            component={SeedView}
            {...{ seed, fetchSeed, fetchingSeed }}
          />,
          <Wizard.Step key="SeedConfirm" component={SeedConfirm} {...{ seed }} />,
          <Wizard.Step key="Password" component={Password} {...{ setPassword }} />,
          <Wizard.Step key="Name" component={Name} {...{ name, setName }} />,
          <Wizard.Step key="Autopilot" component={Autopilot} {...{ autopilot, setAutopilot }} />,
          <Wizard.Step key="WalletCreate" component={WalletCreate} {...{ createNewWallet }} />
        ]
        break

      /**
       * Form steps for import flow.
       */
      case 'import':
        formSteps = [
          ...formSteps,
          <Wizard.Step key="Recover" component={Recover} {...{ seed }} />,
          <Wizard.Step key="Password" component={Password} {...{ setPassword }} />,
          <Wizard.Step key="Name" component={Name} {...{ name, setName }} />,
          <Wizard.Step key="Autopilot" component={Autopilot} {...{ autopilot, setAutopilot }} />,
          <Wizard.Step key="WalletRecover" component={WalletRecover} {...{ recoverOldWallet }} />
        ]
        break

      /**
       * Form steps for custom connection flow.
       */
      case 'custom':
        formSteps = [
          <Wizard.Step
            key="ConnectionDetails"
            component={ConnectionDetails}
            {...{
              connectionHost,
              connectionCert,
              connectionMacaroon,
              startLndHostError,
              startLndCertError,
              startLndMacaroonError,
              setConnectionHost,
              setConnectionCert,
              setConnectionMacaroon,
              validateHost,
              validateCert,
              validateMacaroon
            }}
          />,
          <Wizard.Step
            key="ConnectionConfirm"
            component={ConnectionConfirm}
            {...{
              connectionType,
              connectionHost,
              connectionCert,
              connectionMacaroon,
              lightningGrpcActive,
              walletUnlockerGrpcActive,
              startLndHostError,
              startLndCertError,
              startLndMacaroonError,
              startLnd
            }}
          />,
          <Wizard.Step
            key="Login"
            component={Login}
            {...{ unlockWallet, setUnlockWalletError, unlockWalletError }}
          />
        ]
        break

      /**
       * Form steps for BTCPay Server connection flow.
       */
      case 'btcpayserver':
        formSteps = [
          <Wizard.Step
            key="BtcPayServer"
            component={BtcPayServer}
            {...{
              connectionString,
              startLndHostError,
              setConnectionString
            }}
          />,
          <Wizard.Step
            key="ConnectionConfirm"
            component={ConnectionConfirm}
            {...{
              connectionType,
              connectionString,
              lightningGrpcActive,
              walletUnlockerGrpcActive,
              startLndHostError,
              startLndCertError,
              startLndMacaroonError,
              startLnd
            }}
          />,
          <Wizard.Step
            key="Login"
            component={Login}
            {...{ unlockWallet, setUnlockWalletError, unlockWalletError }}
          />
        ]
        break
    }

    const steps = [
      <Wizard.Step
        key="ConnectionType"
        component={ConnectionType}
        {...{ connectionType, setConnectionType, resetOnboarding, stopLnd }}
      />,
      ...formSteps
    ]
    return steps
  }

  /**
   * If we have already started the create new wallet process and generated a seed, change the text on the back button
   * since it will act as a reset button in this case.
   */
  getBackButtonText = () => {
    const { seed } = this.props
    return seed.length > 0 ? (
      <FormattedMessage {...messages.start_over} />
    ) : (
      <FormattedMessage {...messages.previous} />
    )
  }

  /**
   * If we have already started the create new wallet process and generated a seed, configure the back button to
   * navigate back to step 1.
   */
  getPreviousStep = () => {
    const { seed } = this.props
    return seed.length > 0 ? 0 : null
  }

  render() {
    const { connectionType, onboarded } = this.props
    const steps = this.getSteps()
    const previousStep = this.getPreviousStep()
    const backButtonText = this.getBackButtonText()

    if (onboarded) {
      return <Redirect to={['create', 'import'].includes(connectionType) ? '/syncing' : '/app'} />
    }

    return (
      <Wizard steps={steps}>
        <Flex css={{ height: '100%' }}>
          <Panel width={1}>
            <Panel.Body width={9 / 16} mx="auto">
              <Wizard.Steps />
            </Panel.Body>

            <Panel.Footer>
              <Flex justifyContent="space-between">
                <Box>
                  <Wizard.BackButton navigateTo={previousStep}>{backButtonText}</Wizard.BackButton>
                </Box>
                <Box ml="auto">
                  <Wizard.NextButton>
                    <FormattedMessage {...messages.next} />
                  </Wizard.NextButton>
                </Box>
              </Flex>
            </Panel.Footer>
          </Panel>
        </Flex>
      </Wizard>
    )
  }
}

export default Onboarding
