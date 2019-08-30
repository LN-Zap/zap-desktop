import React from 'react'
import PropTypes from 'prop-types'
import { Flex } from 'rebass/styled-components'
import { FormattedMessage, injectIntl } from 'react-intl'
import { intlShape } from '@zap/i18n'
import { convert } from '@zap/utils/btc'
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
    intl,
  } = props

  const renderLiquidityWarning = props => {
    const { currentStep, maxOneTimeSend, cryptoUnit, isLn, amountInSats } = props

    if (currentStep !== PAY_FORM_STEPS.summary) {
      return null
    }

    const isNotEnoughFunds = !isEnoughFunds(props)
    const isAboveMax = isLn && amountInSats > maxOneTimeSend
    const formattedMax = intl.formatNumber(convert('sats', cryptoUnit, maxOneTimeSend), {
      maximumFractionDigits: 8,
    })
    return (
      <Flex alignItems="center" flexDirection="column">
        {isNotEnoughFunds ? (
          <Message mb={2} variant="error">
            <FormattedMessage {...messages.error_not_enough_funds} />
          </Message>
        ) : (
          isAboveMax && (
            <Message justifyContent="center" mb={2} variant="warning">
              <FormattedMessage
                {...messages.error_not_onetime_send_capacity}
                values={{ capacity: formattedMax, unit: cryptoUnit }}
              />
            </Message>
          )
        )}
      </Flex>
    )
  }

  // Determine which buttons should be visible.
  const hasBackButton = currentStep !== PAY_FORM_STEPS.address
  const hasSubmitButton = currentStep !== PAY_FORM_STEPS.address || (isOnchain || isLn)

  return (
    <Flex flexDirection="column">
      {renderLiquidityWarning(props)}
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
        <>
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
        </>
      )}
    </Flex>
  )
}

PayPanelFooter.propTypes = {
  amountInSats: PropTypes.number.isRequired,
  channelBalance: PropTypes.number.isRequired,
  cryptoUnit: PropTypes.string.isRequired,
  cryptoUnitName: PropTypes.string.isRequired,
  currentStep: PropTypes.string.isRequired,
  formState: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  invoice: PropTypes.object,
  isLn: PropTypes.bool,
  isOnchain: PropTypes.bool,
  isProcessing: PropTypes.bool,
  maxOneTimeSend: PropTypes.number.isRequired,
  previousStep: PropTypes.func.isRequired,
  walletBalanceConfirmed: PropTypes.number.isRequired,
}

export default injectIntl(PayPanelFooter)
