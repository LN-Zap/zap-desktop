import React from 'react'
import PropTypes from 'prop-types'
import { intlShape } from '@zap/i18n'
import PayAddressField from './PayAddressField'
import PayAmountFields from './PayAmountFields'
import PayHelpText from './PayHelpText'
import PaySummary from './PaySummary'
import { PAY_FORM_STEPS } from './constants'

const PayPanelBody = props => {
  const { currentStep } = props

  return (
    <>
      <PayHelpText {...props} />
      <PayAddressField {...props} />
      <PayAmountFields {...props} />
      {currentStep === PAY_FORM_STEPS.summary && <PaySummary {...props} />}
    </>
  )
}

PayPanelBody.propTypes = {
  amountInSats: PropTypes.number.isRequired,
  chain: PropTypes.string.isRequired,
  chainName: PropTypes.string.isRequired,
  cryptoUnit: PropTypes.string.isRequired,
  cryptoUnitName: PropTypes.string.isRequired,
  currentStep: PropTypes.string.isRequired,
  formApi: PropTypes.object.isRequired,
  handlePayReqChange: PropTypes.func.isRequired,
  initialAmountCrypto: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  initialAmountFiat: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  intl: intlShape.isRequired,
  invoice: PropTypes.object,
  isLn: PropTypes.bool,
  isOnchain: PropTypes.bool,
  isQueryingFees: PropTypes.bool,
  lndTargetConfirmations: PropTypes.shape({
    fast: PropTypes.number.isRequired,
    medium: PropTypes.number.isRequired,
    slow: PropTypes.number.isRequired,
  }).isRequired,
  network: PropTypes.string.isRequired,
  previousStep: PropTypes.string,
  queryFees: PropTypes.func.isRequired,
  redirectPayReq: PropTypes.object,
  routes: PropTypes.array,
  walletBalanceConfirmed: PropTypes.number.isRequired,
}

PayPanelBody.defaultProps = {
  initialAmountCrypto: null,
  initialAmountFiat: null,
  redirectPayReq: null,
  routes: [],
}

export default PayPanelBody
