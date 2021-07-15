import React, { useRef } from 'react'

import PropTypes from 'prop-types'
import { FormattedMessage, useIntl } from 'react-intl'
import { Flex } from 'rebass/styled-components'

import { convert } from '@zap/utils/btc'
import { CoinBig } from '@zap/utils/coin'
import { Message, Text } from 'components/UI'
import { CryptoValue } from 'containers/UI'
import { usePrevious } from 'hooks'

import { PAY_FORM_STEPS, PAYMENT_TYPES } from './constants'
import messages from './messages'
import PayButtons from './PayButtons'

const isEnoughFunds = props => {
  // convert entered amount to satoshis
  const { amountInSats, channelBalance, invoice, paymentType, walletBalanceConfirmed } = props

  if (amountInSats === 'NaN') {
    return true
  }

  // Determine whether we have enough funds available.
  let hasEnoughFunds = true
  const isBolt11 = paymentType === PAYMENT_TYPES.bolt11
  const isPubkey = paymentType === PAYMENT_TYPES.pubkey
  const isOnchain = paymentType === PAYMENT_TYPES.onchain
  if ((isBolt11 && invoice) || isPubkey) {
    hasEnoughFunds = CoinBig(amountInSats).lte(channelBalance)
  } else if (isOnchain) {
    hasEnoughFunds = CoinBig(amountInSats).lte(walletBalanceConfirmed)
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
          &nbsp;
          <CryptoValue value={amountInSats} />
          &nbsp;
          {cryptoUnitName}
        </>
      )
    }
  }

  return nextButtonText
}

const LiquidityWarning = ({
  maxOneTimeSend,
  cryptoUnit,
  amountInSats,
  isNotEnoughFunds,
  paymentType,
}) => {
  const { formatNumber } = useIntl()
  const isBolt11 = paymentType === PAYMENT_TYPES.bolt11
  const isPubkey = paymentType === PAYMENT_TYPES.pubkey
  const isAboveMax = (isBolt11 || isPubkey) && CoinBig(amountInSats).gt(maxOneTimeSend)
  const formattedMax = formatNumber(convert('sats', cryptoUnit, maxOneTimeSend), {
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

LiquidityWarning.propTypes = {
  amountInSats: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  cryptoUnit: PropTypes.string.isRequired,
  isNotEnoughFunds: PropTypes.bool,
  maxOneTimeSend: PropTypes.string.isRequired,
  paymentType: PropTypes.oneOf(Object.values(PAYMENT_TYPES)).isRequired,
}

const PayPanelFooter = props => {
  const hasEnoughFunds = isEnoughFunds(props)
  const {
    amountInSats,
    channelBalance,
    cryptoUnit,
    cryptoUnitName,
    currentStep,
    formState,
    isProcessing,
    maxOneTimeSend,
    paymentType,
    previousStep,
    walletBalanceConfirmed,
  } = props

  const prevStep = usePrevious(currentStep)
  const isChangedStep = prevStep && currentStep !== prevStep
  const isPaymentTypeSet = paymentType !== PAYMENT_TYPES.none
  const isAddressStep = currentStep === PAY_FORM_STEPS.address

  const hadPaymentTypeRef = useRef(isPaymentTypeSet)
  if (isPaymentTypeSet) {
    hadPaymentTypeRef.current = true
  }
  const hadPaymentType = hadPaymentTypeRef.current

  // Determine which buttons should be visible.
  const hasBackButton = currentStep !== PAY_FORM_STEPS.address
  const hasSubmitButton = hadPaymentType || isPaymentTypeSet || isChangedStep || !isAddressStep

  // Determine wether the submit button should be disabled.
  const willValidateInvalid = !isAddressStep || (isAddressStep && !isPaymentTypeSet)
  const isDisabled =
    formState.pristine ||
    isProcessing ||
    (currentStep === PAY_FORM_STEPS.summary && !hasEnoughFunds) ||
    (willValidateInvalid && formState.invalid)

  return (
    <Flex flexDirection="column">
      {!isAddressStep && (
        <LiquidityWarning
          amountInSats={amountInSats}
          cryptoUnit={cryptoUnit}
          isNotEnoughFunds={!isEnoughFunds(props)}
          maxOneTimeSend={maxOneTimeSend}
          paymentType={paymentType}
        />
      )}

      <PayButtons
        hasBackButton={hasBackButton}
        hasSubmitButton={hasSubmitButton}
        isDisabled={isDisabled}
        isProcessing={isProcessing}
        nextButtonText={getNextButtonText(formState, props)}
        previousStep={previousStep}
      />

      {walletBalanceConfirmed !== null && (
        <>
          <Text fontWeight="normal" mt={3} textAlign="center">
            <FormattedMessage {...messages.current_balance} />
          </Text>
          <Text fontSize="xs" textAlign="center">
            <FormattedMessage
              {...messages.onchain_balance}
              values={{
                amount: <CryptoValue value={walletBalanceConfirmed} />,
                cryptoUnitName,
              }}
            />
          </Text>
          <Text fontSize="xs" textAlign="center">
            <FormattedMessage
              {...messages.lightning_balance}
              values={{
                amount: <CryptoValue value={channelBalance} />,
                cryptoUnitName,
              }}
            />
          </Text>
        </>
      )}
    </Flex>
  )
}

PayPanelFooter.propTypes = {
  amountInSats: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  channelBalance: PropTypes.string.isRequired,
  cryptoUnit: PropTypes.string.isRequired,
  cryptoUnitName: PropTypes.string.isRequired,
  currentStep: PropTypes.string.isRequired,
  formState: PropTypes.object.isRequired,
  invoice: PropTypes.object,
  isProcessing: PropTypes.bool,
  maxOneTimeSend: PropTypes.string.isRequired,
  paymentType: PropTypes.oneOf(Object.values(PAYMENT_TYPES)).isRequired,
  previousStep: PropTypes.func.isRequired,
  walletBalanceConfirmed: PropTypes.string.isRequired,
}

export default PayPanelFooter
