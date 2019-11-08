import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, useIntl } from 'react-intl'
import { useFieldState } from 'informed'
import { isOnchain, isLn, decodePayReq } from '@zap/utils/crypto'
import { Message } from 'components/UI'
import TextArea from './TextArea'
import messages from './messages'

const validate = (intl, network, chain, value) => {
  if (value) {
    let chainName = `${chain}/lightning`
    if (network !== 'mainnet') {
      chainName += ` (${network})`
    }
    const invalidRequestMessage = intl.formatMessage(
      { ...messages.invalid_request },
      { chain: chainName }
    )
    // If we have a LN invoice, ensure the invoice has an amount.
    if (isLn(value, chain, network)) {
      try {
        const invoice = decodePayReq(value)
        if (!invoice || (!invoice.satoshis && !invoice.millisatoshis)) {
          throw new Error('Invalid invoice')
        }
      } catch (e) {
        return invalidRequestMessage
      }
    } else if (!isOnchain(value, chain, network)) {
      return invalidRequestMessage
    }
  }
  return undefined
}

const LightningInvoiceInput = props => {
  const { network, chain, field } = props
  const intl = useIntl()
  const fieldState = useFieldState(field)
  const { value } = fieldState
  let chainName = isLn(value, chain, network) ? 'lightning' : chain
  if (network !== 'mainnet') {
    chainName += ` (${network})`
  }

  const doValidate = useCallback(value => validate(intl, network, chain, value), [
    chain,
    intl,
    network,
  ])

  return (
    <>
      <TextArea validate={doValidate} {...props} validateOnBlur validateOnChange />
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
    </>
  )
}

LightningInvoiceInput.displayName = 'LightningInvoiceInput'

LightningInvoiceInput.propTypes = {
  chain: PropTypes.oneOf(['bitcoin']),
  field: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  network: PropTypes.oneOf(['mainnet', 'testnet', 'regtest', 'simnet']),
}

export default LightningInvoiceInput
