import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { asField } from 'informed'
import { isOnchain, isLn, decodePayReq } from '@zap/utils/crypto'
import { Message } from 'components/UI'
import { BasicTextArea } from './TextArea'
import messages from './messages'
import { intlShape } from '@zap/i18n'

class LightningInvoiceInput extends React.Component {
  static displayName = 'LightningInvoiceInput'

  static propTypes = {
    chain: PropTypes.oneOf(['bitcoin', 'litecoin']),
    intl: intlShape.isRequired,
    isRequired: PropTypes.bool,
    network: PropTypes.oneOf(['mainnet', 'testnet', 'regtest', 'simnet']),
  }

  validate = value => {
    const { intl } = this.props
    const { network, chain, isRequired } = this.props

    let chainName = `${chain}/lightning`
    if (network !== 'mainnet') {
      chainName += ` (${network})`
    }

    // Ensure we have a value.
    if (isRequired && (!value || value.trim() === '')) {
      return intl.formatMessage({ ...messages.required_field })
    }

    if (value) {
      const invoiceIsLn = isLn(value, chain, network)
      const invoiceIsOnchain = isOnchain(value, chain, network)

      // Ensure we have a valid invoice or address.
      if (!invoiceIsLn && !invoiceIsOnchain) {
        return intl.formatMessage({ ...messages.invalid_request }, { chain: chainName })
      }

      // If we have a LN invoice, ensure the invoice has an amount.
      if (invoiceIsLn) {
        try {
          const invoice = decodePayReq(value)
          if (!invoice || (!invoice.satoshis && !invoice.millisatoshis)) {
            throw new Error('Invalid invoice')
          }
        } catch (e) {
          return intl.formatMessage({ ...messages.invalid_request }, { chain: chainName })
        }
      }
    }
  }

  render() {
    const { chain, intl } = this.props

    return (
      <InformedTextArea
        description={intl.formatMessage(
          {
            ...messages.payreq_placeholder,
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
      <BasicTextArea {...rest} fieldApi={fieldApi} fieldState={fieldState} />
      {value && !fieldState.error && (
        <Message mt={2} variant="success">
          <FormattedMessage
            {...messages.valid_request}
            values={{
              chain: chainName,
            }}
          />
        </Message>
      )}
    </React.Fragment>
  )
})

export default injectIntl(LightningInvoiceInput)
