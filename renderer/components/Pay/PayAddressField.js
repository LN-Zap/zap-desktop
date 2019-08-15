import React from 'react'
import PropTypes from 'prop-types'
import { Box } from 'rebass'
import { Keyframes } from 'react-spring/renderprops.cjs'
import { intlShape } from '@zap/i18n'
import { LightningInvoiceInput } from 'components/Form'
import messages from './messages'
import { PAY_FORM_STEPS } from './constants'

/**
 * Animation to handle showing/hiding the payReq field.
 */
const ShowHidePayReq = Keyframes.Spring({
  small: { height: 48 },
  big: async (next, cancel, ownProps) => {
    ownProps.context.focusPayReqInput()
    await next({ height: 110, immediate: true })
  },
})

class PayAddressField extends React.Component {
  static propTypes = {
    chain: PropTypes.string.isRequired,
    currentStep: PropTypes.string.isRequired,
    handlePayReqChange: PropTypes.func.isRequired,
    intl: intlShape.isRequired,
    isLn: PropTypes.bool,
    network: PropTypes.string.isRequired,
    redirectPayReq: PropTypes.object,
  }

  static defaultProps = {
    redirectPayReq: null,
  }

  payReqInput = React.createRef()

  /**
   * focusPayReqInput - Focus the payReq input.
   */
  focusPayReqInput = () => {
    if (this.payReqInput.current) {
      this.payReqInput.current.focus()
    }
  }

  render() {
    const {
      chain,
      currentStep,
      handlePayReqChange,
      intl,
      isLn,
      network,
      redirectPayReq,
    } = this.props

    const payReq_label =
      currentStep === PAY_FORM_STEPS.address
        ? 'request_label_combined'
        : isLn
        ? 'request_label_offchain'
        : 'request_label_onchain'

    const addressFieldState = currentStep === PAY_FORM_STEPS.address || isLn ? 'big' : 'small'

    return (
      <Box className={currentStep === PAY_FORM_STEPS.summary ? 'element-hide' : 'element-show'}>
        <ShowHidePayReq context={this} state={addressFieldState}>
          {styles => (
            <React.Fragment>
              <LightningInvoiceInput
                chain={chain}
                css={`
                  resize: vertical;
                  min-height: 48px;
                `}
                field="payReq"
                forwardedRef={this.payReqInput}
                initialValue={redirectPayReq && redirectPayReq.address}
                isReadOnly={currentStep !== PAY_FORM_STEPS.address}
                isRequired
                label={intl.formatMessage({ ...messages[payReq_label] })}
                name="payReq"
                network={network}
                onValueChange={handlePayReqChange}
                style={styles}
                validateOnBlur
                validateOnChange
                width={1}
                willAutoFocus
              />
            </React.Fragment>
          )}
        </ShowHidePayReq>
      </Box>
    )
  }
}

export default PayAddressField
