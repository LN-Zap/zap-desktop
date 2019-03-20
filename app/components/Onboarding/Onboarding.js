import React from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { Flex, Box } from 'rebass'
import { Panel, Wizard } from 'components/UI'
import {
  Autopilot,
  ConnectionType,
  ConnectionDetails,
  ConnectionConfirm,
  Login,
  Name,
  Network,
  Password,
  Recover,
  SeedConfirm,
  SeedView,
  WalletCreate,
  WalletRecover,
} from './Steps'
import messages from './messages'

class Onboarding extends React.Component {
  static propTypes = {
    // STATE
    autopilot: PropTypes.bool, // eslint-disable-line react/boolean-prop-naming
    clearStartLndError: PropTypes.func.isRequired,
    connectionCert: PropTypes.string,
    connectionHost: PropTypes.string,
    connectionMacaroon: PropTypes.string,
    connectionString: PropTypes.string,
    connectionType: PropTypes.string,
    createNewWallet: PropTypes.func.isRequired,
    fetchSeed: PropTypes.func.isRequired,
    isFetchingSeed: PropTypes.bool,
    isLightningGrpcActive: PropTypes.bool,
    isOnboarded: PropTypes.bool,
    isWalletUnlockerGrpcActive: PropTypes.bool,
    lndConnect: PropTypes.string,
    name: PropTypes.string,
    network: PropTypes.string,
    recoverOldWallet: PropTypes.func.isRequired,
    resetOnboarding: PropTypes.func.isRequired,

    // DISPATCH
    seed: PropTypes.array,
    setAutopilot: PropTypes.func.isRequired,
    setConnectionCert: PropTypes.func.isRequired,
    setConnectionHost: PropTypes.func.isRequired,
    setConnectionMacaroon: PropTypes.func.isRequired,
    setConnectionString: PropTypes.func.isRequired,
    setConnectionType: PropTypes.func.isRequired,
    setLndconnect: PropTypes.func.isRequired,
    setName: PropTypes.func.isRequired,
    setNetwork: PropTypes.func.isRequired,
    setPassword: PropTypes.func.isRequired,
    setSeed: PropTypes.func.isRequired,
    setUnlockWalletError: PropTypes.func.isRequired,
    startLnd: PropTypes.func.isRequired,
    startLndCertError: PropTypes.string,
    startLndHostError: PropTypes.string,
    startLndMacaroonError: PropTypes.string,
    stopLnd: PropTypes.func.isRequired,
    unlockWallet: PropTypes.func.isRequired,
    unlockWalletError: PropTypes.string,
    validateCert: PropTypes.func.isRequired,
    validateHost: PropTypes.func.isRequired,
    validateMacaroon: PropTypes.func.isRequired,
  }

  componentWillUnmount() {
    const { resetOnboarding } = this.props
    resetOnboarding()
  }

  /**
   * Remove Autopilot form step if the currently selected network is mainnet.
   * @param  {{key: string}[]} formSteps List of form steps.
   * @return {{key: string}[]} Modified list of form steps.
   */
  removeAutopilotStepIfMainnet = formSteps => {
    const { network, setAutopilot } = this.props
    if (network === 'mainnet') {
      const index = formSteps.findIndex(s => s.key === 'Autopilot')
      if (index >= 0) {
        formSteps.splice(index, 1)
      }
      setAutopilot(false)
    }
    return formSteps
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
      network,
      connectionType,
      connectionHost,
      connectionCert,
      connectionMacaroon,
      connectionString,
      isLightningGrpcActive,
      isWalletUnlockerGrpcActive,
      seed,
      startLndHostError,
      startLndCertError,
      startLndMacaroonError,
      unlockWalletError,
      isFetchingSeed,
      lndConnect,

      // DISPATCH
      setAutopilot,
      setConnectionType,
      setConnectionHost,
      setConnectionCert,
      setConnectionMacaroon,
      setConnectionString,
      setName,
      setNetwork,
      setUnlockWalletError,
      setPassword,
      setSeed,
      clearStartLndError,
      setLndconnect,
      startLnd,
      validateHost,
      validateCert,
      validateMacaroon,
      fetchSeed,
      resetOnboarding,
      createNewWallet,
      recoverOldWallet,
      stopLnd,
      unlockWallet,
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
            {...{ seed, fetchSeed, isFetchingSeed }}
          />,
          <Wizard.Step key="SeedConfirm" component={SeedConfirm} {...{ seed }} />,
          <Wizard.Step key="Password" component={Password} {...{ setPassword }} />,
          <Wizard.Step key="Name" component={Name} {...{ name, setName }} />,
          <Wizard.Step key="Network" component={Network} {...{ network, setNetwork }} />,
          <Wizard.Step key="Autopilot" component={Autopilot} {...{ autopilot, setAutopilot }} />,
          <Wizard.Step key="WalletCreate" component={WalletCreate} {...{ createNewWallet }} />,
        ]
        break

      /**
       * Form steps for import flow.
       */
      case 'import':
        formSteps = [
          ...formSteps,
          <Wizard.Step key="Recover" component={Recover} {...{ seed, setSeed }} />,
          <Wizard.Step key="Password" component={Password} {...{ setPassword }} />,
          <Wizard.Step key="Name" component={Name} {...{ name, setName }} />,
          <Wizard.Step key="Network" component={Network} {...{ network, setNetwork }} />,
          <Wizard.Step key="Autopilot" component={Autopilot} {...{ autopilot, setAutopilot }} />,
          <Wizard.Step key="WalletRecover" component={WalletRecover} {...{ recoverOldWallet }} />,
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
              connectionString,
              lndConnect,
              setLndconnect,
              startLndHostError,
              startLndCertError,
              startLndMacaroonError,
              setConnectionHost,
              setConnectionCert,
              setConnectionMacaroon,
              setConnectionString,
              clearStartLndError,
              validateHost,
              validateCert,
              validateMacaroon,
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
              connectionString,
              lndConnect,
              isLightningGrpcActive,
              isWalletUnlockerGrpcActive,
              startLndHostError,
              startLndCertError,
              startLndMacaroonError,
              startLnd,
            }}
          />,
          <Wizard.Step
            key="Login"
            component={Login}
            {...{ unlockWallet, setUnlockWalletError, unlockWalletError }}
          />,
        ]
        break
    }

    const steps = [
      <Wizard.Step
        key="ConnectionType"
        component={ConnectionType}
        {...{ connectionType, setConnectionType, lndConnect, resetOnboarding, stopLnd }}
      />,
      ...formSteps,
    ]

    // It is currently not recommended to use autopilot on mainnet.
    // If user has selected mainnet, remove the autopilot form step.
    this.removeAutopilotStepIfMainnet(steps)

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
    const { connectionType, isOnboarded } = this.props
    const steps = this.getSteps()
    const previousStep = this.getPreviousStep()
    const backButtonText = this.getBackButtonText()

    if (isOnboarded) {
      return <Redirect to={['create', 'import'].includes(connectionType) ? '/syncing' : '/app'} />
    }

    return (
      <Wizard steps={steps}>
        <Flex css={{ height: '100%' }}>
          <Panel width={1}>
            <Panel.Body mx="auto" width={9 / 16}>
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
