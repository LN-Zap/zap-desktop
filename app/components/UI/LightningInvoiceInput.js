import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, intlShape, injectIntl } from 'react-intl'
import { asField } from 'informed'
import { isOnchain, isLn } from 'lib/utils/crypto'
import TextArea from './TextArea'
import Message from './Message'
import messages from './messages'

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
    intl: intlShape.isRequired,
    required: PropTypes.bool,
    chain: PropTypes.oneOf(['bitcoin', 'litecoin']),
    network: PropTypes.oneOf(['mainnet', 'testnet', 'regtest'])
  }

  static defaultProps = {
    required: false
  }

  validate = value => {
    const { intl } = this.props
    const { network, chain, required } = this.props

    let chainName = `${chain}/lightning`
    if (network !== 'mainnet') {
      chainName += ` (${network})`
    }

    if (required && (!value || value.trim() === '')) {
      return intl.formatMessage({ ...messages.required_field })
    }
    if (value && !isLn(value, chain, network) && !isOnchain(value, chain, network)) {
      return intl.formatMessage({ ...messages.invalid_request }, { chain: chainName })
    }
  }

  render() {
    const { chain, intl } = this.props

    return (
      <InformedTextArea
        placeholder={intl.formatMessage(
          {
            ...messages.payreq_placeholder
          },
          { chain }
        )}
        rows={5}
        {...this.props}
        spellCheck="false"
        validate={this.validate}
      />
    )
  }
}

const InformedTextArea = asField(({ fieldState, fieldApi, ...props }) => {
  const { value } = fieldState
  const { chain, network, ...rest } = props

  let chainName = isLn(value, chain, network) ? 'lightning' : chain
  if (network !== 'mainnet') {
    chainName += ` (${network})`
  }
  return (
    <React.Fragment>
      <TextArea {...rest} />
      {value && !fieldState.error && (
        <Message variant="success" mt={2}>
          <FormattedMessage
            {...messages.valid_request}
            values={{
              chain: chainName
            }}
          />
        </Message>
      )}
    </React.Fragment>
  )
})

export default injectIntl(LightningInvoiceInput)
