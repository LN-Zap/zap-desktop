import React, { useEffect } from 'react'

import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Flex, Box } from 'rebass/styled-components'
import styled from 'styled-components'

import {
  isMainnetAutopilot,
  isNetworkSelectionEnabled,
  isSCBRestoreEnabled,
} from '@zap/utils/featureFlag'
import AppErrorBoundary from 'components/ErrorBoundary/AppErrorBoundary'
import messages from 'components/Onboarding/messages'
import { Panel, Wizard, Modal, ModalOverlayStyles } from 'components/UI'
import { usePrevious, useOnKeydown } from 'hooks'
import { backupSelectors } from 'reducers/backup'

import * as Steps from './Steps'

/**
 * removeSteps - Remove for steps based on a set of conditions.
 *
 * @param {{key: string}[]} formSteps List of form steps
 * @param {Array<Array<[string, boolean]>>} steps array of `step name`, `condition` pairs
 * if `condition` then step is removed
 * @returns {object} Updated list of form steps
 */
function removeSteps(formSteps, steps) {
  return steps.reduce((acc, next) => {
    const [stepName, condition] = next
    if (condition) {
      return acc.filter(s => s.key !== stepName)
    }
    return acc
  }, formSteps)
}

/**
 * getSteps - Dynamically generte form steps to use in the onboarding Wizzard.
 *
 * @param {string} connectionType
 * @returns {Array} A list of WizardSteps.
 */

const getBaseSteps = connectionType => {
  let formSteps
  switch (connectionType) {
    /**
     * Form steps for create flow.
     */
    case 'create':
      formSteps = [
        <Steps.SeedView key="SeedView" />,
        <Steps.SeedConfirm key="SeedConfirm" />,
        <Steps.Password key="Password" />,
        <Steps.Name key="Name" />,
        <Steps.Network key="Network" />,
        <Steps.Autopilot key="Autopilot" />,
        <Steps.BackupSetup canSkip key="BackupSetup" />,
        <Steps.BackupSetupLocal key="BackupSetupLocal" />,
        <Steps.WalletCreate key="WalletCreate" />,
      ]
      break

    /**
     * Form steps for import flow.
     */
    case 'import':
      formSteps = [
        <Steps.Recover key="Recover" />,
        <Steps.Password key="Password" />,
        <Steps.Name key="Name" />,
        <Steps.Network key="Network" />,
        <Steps.Autopilot key="Autopilot" />,
        <Steps.BackupSetup canSkip isRestoreMode key="BackupSetup" />,
        <Steps.BackupSetupLocal key="BackupSetupLocal" />,
        <Steps.WalletRecover key="WalletRecover" />,
      ]
      break

    /**
     * Form steps for custom connection flow.
     */
    case 'custom':
      formSteps = [
        <Steps.ConnectionDetails key="ConnectionDetails" />,
        <Steps.ConnectionConfirm key="ConnectionConfirm" />,
        <Steps.Login key="Login" />,
      ]
      break

    default:
      formSteps = []
  }

  formSteps.unshift(<Steps.ConnectionType key="ConnectionType" />)
  return formSteps.map(component => (
    <Wizard.Step canSkip={component.props.canSkip} component={component} key={component.key} />
  ))
}

const Onboarding = props => {
  const {
    connectionType,
    network,
    seed,
    backupProvider,
    history,
    isLightningGrpcActive,
    createWalletError,
    isCreatingWallet,
  } = props

  const prevIsCreatingWallet = usePrevious(isCreatingWallet)
  useEffect(() => {
    if (connectionType === 'custom') {
      if (isLightningGrpcActive) {
        history.push('/app')
      }
    } else if (!isCreatingWallet && prevIsCreatingWallet && !createWalletError) {
      history.push('/syncing')
    }
  }, [
    connectionType,
    createWalletError,
    history,
    isCreatingWallet,
    isLightningGrpcActive,
    prevIsCreatingWallet,
  ])

  /**
   * getPreviousStep - If we have already started the create new wallet process and generated a seed, configure the back
   * button to navigate back to step 1.
   *
   * @returns {number} Step index
   */
  const getPreviousStep = () => (seed.length > 0 ? 0 : null)

  /**
   * getBackButtonText - If we have already started the create new wallet process and generated a seed, change the
   * text on the back button since it will act as a reset button in this case.
   *
   * @returns {object} Button text
   */
  const getBackButtonText = () => (
    <FormattedMessage {...(seed.length > 0 ? messages.start_over : messages.previous)} />
  )

  const shouldRemoveBackupSetupStep = () => connectionType === 'import' && !isSCBRestoreEnabled()

  const shouldRemoveBackupSetupLocalStep = () =>
    !backupProvider || backupProvider !== 'local' || shouldRemoveBackupSetupStep()

  const steps = removeSteps(getBaseSteps(connectionType), [
    // It is currently not recommended to use autopilot on mainnet.
    // If user has selected mainnet, remove the autopilot form step.
    ['Autopilot', network === 'mainnet' && !isMainnetAutopilot()],
    ['Network', !isNetworkSelectionEnabled()],
    ['BackupSetupLocal', shouldRemoveBackupSetupLocalStep()],
    ['BackupSetup', shouldRemoveBackupSetupStep()],
  ])

  const previousStep = getPreviousStep()
  const backButtonText = getBackButtonText()

  return (
    <Wizard steps={steps}>
      <Panel width={1}>
        <Panel.Body mx="auto" sx={{ position: 'relative' }} width={9 / 16}>
          <Wizard.Steps />
        </Panel.Body>

        <Panel.Footer>
          <Flex justifyContent="space-between">
            <Box>
              <Wizard.BackButton navigateTo={previousStep}>{backButtonText}</Wizard.BackButton>
            </Box>
            <Box ml="auto">
              <Wizard.SkipButton>
                <FormattedMessage {...messages.skip} />
              </Wizard.SkipButton>
              <Wizard.NextButton>
                <FormattedMessage {...messages.next} />
              </Wizard.NextButton>
            </Box>
          </Flex>
        </Panel.Footer>
      </Panel>
    </Wizard>
  )
}

Onboarding.propTypes = {
  backupProvider: PropTypes.string,
  connectionType: PropTypes.string,
  createWalletError: PropTypes.string,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
  isCreatingWallet: PropTypes.bool,
  isLightningGrpcActive: PropTypes.bool,
  network: PropTypes.string,
  seed: PropTypes.array,
}

const mapStateToProps = state => ({
  backupProvider: backupSelectors.providerSelector(state),
  connectionType: state.onboarding.connectionType,
  seed: state.onboarding.seed,
  isLightningGrpcActive: state.lnd.isLightningGrpcActive,
  createWalletError: state.lnd.createWalletError,
  isCreatingWallet: state.lnd.isCreatingWallet,
  network: state.onboarding.network,
})

const OnboardingContainer = withRouter(connect(mapStateToProps)(Onboarding))
const ModalOverlay = styled.div`
  ${ModalOverlayStyles}
`
const OnboardingModal = ({ hasWallets, onClose, ...rest }) => {
  useOnKeydown('Escape', onClose)

  return (
    <AppErrorBoundary onCloseDialog={onClose}>
      <ModalOverlay>
        <Modal hasClose={hasWallets} onClose={onClose} p={4} sx={{ overflowY: 'overlay' }}>
          <OnboardingContainer {...rest} />
        </Modal>
      </ModalOverlay>
    </AppErrorBoundary>
  )
}

OnboardingModal.propTypes = {
  hasWallets: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
}

export default OnboardingModal
