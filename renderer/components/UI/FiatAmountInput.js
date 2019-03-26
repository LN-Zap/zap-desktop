/* eslint-disable react/no-multi-comp */

import React from 'react'
import PropTypes from 'prop-types'
import { asField } from 'informed'
import * as yup from 'yup'
import { convert } from '@zap/utils/btc'
import { formatValue, parseNumber } from '@zap/utils/crypto'
import { withNumberInputMask } from 'hocs'
import Input from './Input'

/**
 * @render react
 * @name FiatAmountInput
 */
class FiatAmountInput extends React.Component {
  static propTypes = {
    currency: PropTypes.string.isRequired,
    currentTicker: PropTypes.object.isRequired,
    fieldApi: PropTypes.object.isRequired,
    fieldState: PropTypes.object.isRequired,
    isRequired: PropTypes.bool,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
  }

  componentDidUpdate(prevProps) {
    const { currency, currentTicker, fieldApi } = this.props

    // Reformat the value when the currency unit has changed.
    if (currency !== prevProps.currency) {
      const { fieldApi } = this.props
      let value = fieldApi.getValue()
      const lastPriceInOrigCurrency = currentTicker[prevProps.currency]
      const lastPriceInNewCurrency = currentTicker[currency]
      // Convert to BTC.
      const btcValue = convert('fiat', 'btc', value, lastPriceInOrigCurrency)
      // Convert to new currency.
      const newFiatValue = convert('btc', 'fiat', btcValue, lastPriceInNewCurrency)
      const [integer, fractional] = parseNumber(newFiatValue, this.getRules().precision)
      value = formatValue(integer, fractional)
      fieldApi.setValue(value)
    }

    // If the value has changed, reformat it if needed.
    const valueBefore = prevProps.fieldState.value
    const valueAfter = fieldApi.getValue()
    if (valueAfter !== valueBefore) {
      const [integer, fractional] = parseNumber(valueAfter, this.getRules().precision)
      const formattedValue = formatValue(integer, fractional)
      if (formattedValue !== valueAfter) {
        fieldApi.setValue(formattedValue)
      }
    }
  }

  getRules() {
    return {
      precision: 2,
      placeholder: '0.00',
      pattern: '[0-9]*.?[0-9]{0,2}?',
    }
  }

  render() {
    const rules = this.getRules()
    return (
      <Input {...this.props} pattern={rules.pattern} placeholder={rules.placeholder} type="text" />
    )
  }
}

const FiatAmountInputAsField = FiatAmountInput

class WrappedFiatAmountInputAsField extends React.Component {
  static propTypes = {
    isDisabled: PropTypes.bool,
    isRequired: PropTypes.bool,
    validate: PropTypes.func,
  }

  static defaultProps = {
    isDisabled: false,
    isRequired: false,
  }

  validate = value => {
    const { isDisabled, isRequired } = this.props
    if (isDisabled) {
      return
    }
    try {
      let validator = yup
        .number()
        .positive()
        .min(0)
        .typeError('A number is required')
      if (isRequired) {
        validator = validator.required().moreThan(0)
      }
      validator.validateSync(Number(value))
    } catch (error) {
      return error.message
    }

    // Run any additional validation provided by the caller.
    const { validate } = this.props
    if (validate) {
      return validate(value)
    }
  }

  render() {
    return <FiatAmountInputAsField validate={this.validate} {...this.props} />
  }
}

export default asField(withNumberInputMask(WrappedFiatAmountInputAsField))
