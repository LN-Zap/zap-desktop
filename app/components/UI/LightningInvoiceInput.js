import React from 'react'
import PropTypes from 'prop-types'
import { asField } from 'informed'
import { isOnchain, isLn } from 'lib/utils/crypto'
import TextArea from 'components/UI/TextArea'
import FormFieldMessage from 'components/UI/FormFieldMessage'

/**
 * @render react
 * @name LightningInvoiceInput
 * @example
 * <LightningInvoiceInput
     network="testnet"
     field="testnet"
     id="testnet"
     validateOnChange
     validateOnBlur />
 */
class LightningInvoiceInput extends React.Component {
  static displayName = 'LightningInvoiceInput'

  static propTypes = {
    required: PropTypes.bool,
    chain: PropTypes.oneOf(['bitcoin', 'litecoin']),
    network: PropTypes.oneOf(['mainnet', 'testnet', 'regtest'])
  }

  static defaultProps = {
    required: false
  }

  validate = value => {
    const { network, chain, required } = this.props
    if (required && (!value || value.trim() === '')) {
      return 'This is a required field'
    }
    if (value && !isLn(value, chain, network) && !isOnchain(value, chain, network)) {
      return 'Not a valid address.'
    }
  }

  render() {
    return (
      <InformedTextArea
        placeholder="Paste a Lightning Payment Request or Bitcoin Address here"
        rows={5}
        {...this.props}
        validate={this.validate}
      />
    )
  }
}

const InformedTextArea = asField(({ fieldState, fieldApi, ...props }) => {
  const { value } = fieldState
  const { chain, network, ...rest } = props
  return (
    <React.Fragment>
      <TextArea {...rest} />
      {value &&
        !fieldState.error && (
          <FormFieldMessage variant="success" mt={2}>
            Valid {isLn(value, chain, network) ? 'lightning' : chain} address{' '}
            {network !== 'mainnet' && `(${network})`}
          </FormFieldMessage>
        )}
    </React.Fragment>
  )
})

export default LightningInvoiceInput
