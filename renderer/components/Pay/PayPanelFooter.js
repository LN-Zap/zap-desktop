import React from 'react'
import PropTypes from 'prop-types'
import { Box } from 'rebass/styled-components'
import { FormattedMessage } from 'react-intl'
import { CryptoValue } from 'containers/UI'
import { Message, Text } from 'components/UI'
import messages from './messages'
import PayButtons from './PayButtons'
import { PAY_FORM_STEPS } from './constants'

const isEnoughFunds = props => {
  // convert entered amount to satoshis
  const { amountInSats, channelBalance, invoice, isLn, isOnchain, walletBalanceConfirmed } = props

  // Determine whether we have enough funds available.
  let hasEnoughFunds = true
  if (isLn && invoice) {
    hasEnoughFunds = amountInSats <= channelBalance
  } else if (isOnchain) {
    hasEnoughFunds = amountInSats <= walletBalanceConfirmed
  }

  return hasEnoughFunds
}

const getNextButtonText = (formState, props) => {
  const { currentStep } = props
  // Determine what the text should be for the next button.
  let nextButtonText = <FormattedMessage {...messages.next} />
  if (currentStep === PAY_FORM_STEPS.summary) {
    const { isCoinSweep } = formState.values
    if (isCoinSweep) {
      nextButtonText = <FormattedMessage {...messages.send_all} />
    } else {
      const { amountInSats, cryptoUnitName } = props

      nextButtonText = (
        <>
          <FormattedMessage {...messages.send} />
          {` `}
          <CryptoValue value={amountInSats} />
          {` `}
          {cryptoUnitName}
        </>
      )
    }
  }

  return nextButtonText
}

const PayPanelFooter = props => {
  const hasEnoughFunds = isEnoughFunds(props)
  const {
    channelBalance,
    cryptoUnitName,
    currentStep,
    formState,
    isLn,
    isOnchain,
    isProcessing,
    previousStep,
    walletBalanceConfirmed,
  } = props

  // Determine which buttons should be visible.
  const hasBackButton = currentStep !== PAY_FORM_STEPS.address
  const hasSubmitButton = currentStep !== PAY_FORM_STEPS.address || (isOnchain || isLn)

  return (
    <Box>
      {currentStep === PAY_FORM_STEPS.summary && !hasEnoughFunds && (
        <Message justifyContent="center" mb={2} variant="error">
          <FormattedMessage {...messages.error_not_enough_funds} />
        </Message>
      )}

      <PayButtons
        hasBackButton={hasBackButton}
        hasSubmitButton={hasSubmitButton}
        isDisabled={
          formState.pristine ||
          formState.invalid ||
          isProcessing ||
          (currentStep === PAY_FORM_STEPS.summary && !hasEnoughFunds)
        }
        isProcessing={isProcessing}
        nextButtonText={getNextButtonText(formState, props)}
        previousStep={previousStep}
      />

      {walletBalanceConfirmed !== null && (
        <React.Fragment>
          <Text fontWeight="normal" mt={3} textAlign="center">
            <FormattedMessage {...messages.current_balance} />:
          </Text>
          <Text fontSize="xs" textAlign="center">
            <CryptoValue value={walletBalanceConfirmed} />
            {` `}
            {cryptoUnitName}
            {` `}
            <FormattedMessage {...messages.on_chain} />
          </Text>
          <Text fontSize="xs" textAlign="center">
            <CryptoValue value={channelBalance} />
            {` `}
            {cryptoUnitName}
            {` `}
            <FormattedMessage {...messages.in_channels} />
          </Text>
        </React.Fragment>
      )}
    </Box>
  )
}

PayPanelFooter.propTypes = {
  amountInSats: PropTypes.number.isRequired,
  channelBalance: PropTypes.number.isRequired,
  cryptoUnitName: PropTypes.string.isRequired,
  currentStep: PropTypes.string.isRequired,
  formState: PropTypes.object.isRequired,
  invoice: PropTypes.object,
  isLn: PropTypes.bool,
  isOnchain: PropTypes.bool,
  isProcessing: PropTypes.bool,
  previousStep: PropTypes.func.isRequired,
  walletBalanceConfirmed: PropTypes.number.isRequired,
}

export default PayPanelFooter
