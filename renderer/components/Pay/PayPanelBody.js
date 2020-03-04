import React from 'react'
import PropTypes from 'prop-types'
import { intlShape } from '@zap/i18n'
import PayAddressField from './PayAddressField'
import PayAmountFields from './PayAmountFields'
import PayHelpText from './PayHelpText'
import PaySummary from './PaySummary'

const PayPanelBody = props => {
  const {
    amountInSats,
    chain,
    chainName,
    cryptoUnit,
    cryptoUnitName,
    currentStep,
    formApi,
    formState,
    handlePayReqChange,
    initialAmountCrypto,
    initialAmountFiat,
    intl,
    invoice,
    isBolt11,
    isOnchain,
    isPubkey,
    isQueryingFees,
    lndTargetConfirmations,
    network,
    onchainFees,
    previousStep,
    queryFees,
    redirectPayReq,
    routes,
    walletBalanceConfirmed,
  } = props

  return (
    <>
      <PayHelpText
        chainName={chainName}
        cryptoUnitName={cryptoUnitName}
        currentStep={currentStep}
        previousStep={previousStep}
        redirectPayReq={redirectPayReq}
      />
      <PayAddressField
        chain={chain}
        currentStep={currentStep}
        formApi={formState}
        handlePayReqChange={handlePayReqChange}
        intl={intl}
        isBolt11={isBolt11}
        network={network}
        redirectPayReq={redirectPayReq}
      />
      <PayAmountFields
        cryptoUnit={cryptoUnit}
        currentStep={currentStep}
        formApi={formApi}
        initialAmountCrypto={initialAmountCrypto}
        initialAmountFiat={initialAmountFiat}
        intl={intl}
        invoice={invoice}
        isOnchain={isOnchain}
        isPubkey={isPubkey}
        isQueryingFees={isQueryingFees}
        lndTargetConfirmations={lndTargetConfirmations}
        onchainFees={onchainFees}
        queryFees={queryFees}
        walletBalanceConfirmed={walletBalanceConfirmed}
      />
      <PaySummary
        amountInSats={amountInSats}
        currentStep={currentStep}
        formApi={formApi}
        isOnchain={isOnchain}
        isPubkey={isPubkey}
        lndTargetConfirmations={lndTargetConfirmations}
        onchainFees={onchainFees}
        routes={routes}
      />
    </>
  )
}

PayPanelBody.propTypes = {
  amountInSats: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  chain: PropTypes.string.isRequired,
  chainName: PropTypes.string.isRequired,
  cryptoUnit: PropTypes.string.isRequired,
  cryptoUnitName: PropTypes.string.isRequired,
  currentStep: PropTypes.string.isRequired,
  formApi: PropTypes.object.isRequired,
  formState: PropTypes.object.isRequired,
  handlePayReqChange: PropTypes.func.isRequired,
  initialAmountCrypto: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  initialAmountFiat: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  intl: intlShape.isRequired,
  invoice: PropTypes.object,
  isBolt11: PropTypes.bool,
  isOnchain: PropTypes.bool,
  isPubkey: PropTypes.bool,
  isQueryingFees: PropTypes.bool,
  lndTargetConfirmations: PropTypes.shape({
    fast: PropTypes.number.isRequired,
    medium: PropTypes.number.isRequired,
    slow: PropTypes.number.isRequired,
  }).isRequired,
  network: PropTypes.string.isRequired,
  onchainFees: PropTypes.shape({
    fast: PropTypes.number,
    medium: PropTypes.number,
    slow: PropTypes.number,
  }),
  previousStep: PropTypes.string,
  queryFees: PropTypes.func.isRequired,
  redirectPayReq: PropTypes.object,
  routes: PropTypes.array,
  walletBalanceConfirmed: PropTypes.string.isRequired,
}

PayPanelBody.defaultProps = {
  routes: [],
}

export default PayPanelBody
