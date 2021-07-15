import React from 'react'

import PropTypes from 'prop-types'
import { Keyframes } from 'react-spring/renderprops.cjs'
import { Box } from 'rebass/styled-components'

import { intlShape } from '@zap/i18n'
import { LightningInvoiceInput } from 'components/Form'

import { PAY_FORM_STEPS, PAYMENT_TYPES } from './constants'
import messages from './messages'

/**
 * Animation to handle showing/hiding the payReq field.
 */
const ShowHidePayReq = Keyframes.Spring({
  small: { height: 48, resize: 'none', overflow: 'hidden' },
  big: async (next, cancel, ownProps) => {
    ownProps.context.focusPayReqInput()
    await next({ height: 110, immediate: true })
  },
})

class PayAddressField extends React.Component {
  payReqInput = React.createRef()

  static propTypes = {
    chain: PropTypes.string.isRequired,
    currentStep: PropTypes.string.isRequired,
    formState: PropTypes.object,
    handlePayReqChange: PropTypes.func.isRequired,
    intl: intlShape.isRequired,
    network: PropTypes.string.isRequired,
    paymentType: PropTypes.oneOf(Object.values(PAYMENT_TYPES)).isRequired,
    redirectPayReq: PropTypes.object,
  }

  static defaultProps = {
    formState: {
      values: {},
    },
  }

  /**
   * focusPayReqInput - Focus the payReq input.
   */
  focusPayReqInput = () => {
    if (this.payReqInput.current) {
      this.payReqInput.current.focus()
    }
  }

  getPaymentRequestLabel = () => {
    const { currentStep, paymentType } = this.props
    const isPubkey = paymentType === PAYMENT_TYPES.pubkey
    const isBolt11 = paymentType === PAYMENT_TYPES.bolt11
    let payReqLabel
    if (currentStep === PAY_FORM_STEPS.address) {
      payReqLabel = 'request_label_combined'
    } else if (isPubkey) {
      payReqLabel = 'request_label_pubkey'
    } else if (isBolt11) {
      payReqLabel = 'request_label_offchain'
    } else {
      payReqLabel = 'request_label_onchain'
    }

    const { intl } = this.props
    return payReqLabel && intl.formatMessage({ ...messages[payReqLabel] })
  }

  render() {
    const {
      chain,
      currentStep,
      formState,
      handlePayReqChange,
      network,
      paymentType,
      redirectPayReq,
    } = this.props
    const isBolt11 = paymentType === PAYMENT_TYPES.bolt11
    const addressFieldState = currentStep === PAY_FORM_STEPS.address || isBolt11 ? 'big' : 'small'

    const { payReq } = formState.values
    const { submits } = formState
    const willValidateInline = submits > 0 || (submits === 0 && Boolean(payReq))

    return (
      <Box className={currentStep === PAY_FORM_STEPS.summary ? 'element-hide' : 'element-show'}>
        <ShowHidePayReq context={this} state={addressFieldState}>
          {styles => (
            <LightningInvoiceInput
              chain={chain}
              css="resize: vertical;"
              field="payReq"
              forwardedRef={this.payReqInput}
              initialValue={redirectPayReq && redirectPayReq.address}
              isReadOnly={currentStep !== PAY_FORM_STEPS.address}
              isRequired
              label={this.getPaymentRequestLabel()}
              minHeight={48}
              name="payReq"
              network={network}
              onValueChange={handlePayReqChange}
              style={styles}
              validateOnBlur={willValidateInline}
              validateOnChange={willValidateInline}
              width={1}
              willAutoFocus
            />
          )}
        </ShowHidePayReq>
      </Box>
    )
  }
}

export default PayAddressField
