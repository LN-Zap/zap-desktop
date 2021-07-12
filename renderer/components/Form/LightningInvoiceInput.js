import React, { useCallback } from 'react'

import { useFormState } from 'informed'
import PropTypes from 'prop-types'
import { FormattedMessage, useIntl } from 'react-intl'

import { isOnchain, isBip21, isBolt11, isPubkey, decodePayReq } from '@zap/utils/crypto'
import { Message } from 'components/UI'

import messages from './messages'
import TextArea from './TextArea'

const mask = value => (value ? value.split('@')[0].trim() : value)

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
    if (isBolt11(value, chain, network)) {
      try {
        const invoice = decodePayReq(value)
        if (!invoice) {
          throw new Error('Invalid invoice')
        }

        if (!invoice.satoshis && !invoice.millisatoshis) {
          return intl.formatMessage({ ...messages.zero_amount_request })
        }
      } catch (e) {
        return invalidRequestMessage
      }
    } else if (!isOnchain(value, chain, network) && !isPubkey(value) && !isBip21(value)) {
      return invalidRequestMessage
    }
  }
  return undefined
}

const LightningInvoiceInput = props => {
  const { network, chain, field } = props
  const intl = useIntl()
  const { values, errors } = useFormState()
  const value = values && values[field]
  const error = errors && errors[field]
  let chainName = isBolt11(value, chain, network) || isPubkey(value) ? 'lightning' : chain
  if (network !== 'mainnet') {
    chainName += ` (${network})`
  }

  const doValidate = useCallback(v => validate(intl, network, chain, v), [chain, intl, network])

  return (
    <>
      <TextArea mask={mask} validate={doValidate} {...props} validateOnBlur validateOnChange />
      {value && !error && (
        <Message mt={2} variant="success">
          <FormattedMessage
            {...messages[isPubkey(value) ? 'valid_pubkey' : 'valid_request']}
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
