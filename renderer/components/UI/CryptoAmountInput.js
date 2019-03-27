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
 * @name CryptoAmountInput
 */
class CryptoAmountInput extends React.Component {
  static propTypes = {
    currency: PropTypes.string.isRequired,
    fieldApi: PropTypes.object.isRequired,
    fieldState: PropTypes.object.isRequired,
    isRequired: PropTypes.bool,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
  }

  /**
   * Reformat the value when the currency unit has changed.
   */
  componentDidUpdate(prevProps) {
    const { currency, fieldApi } = this.props

    // Reformat the value when the currency unit has changed.
    if (currency !== prevProps.currency) {
      const { fieldApi } = this.props
      let value = fieldApi.getValue()
      const convertedValue = convert(prevProps.currency, currency, value)
      const [integer, fractional] = parseNumber(convertedValue, this.getRules().precision)
      value = formatValue(integer, fractional)
      fieldApi.setValue(value)
    }

    // If the value has changed, reformat it if needed.
    const valueBefore = prevProps.fieldState.value
    const valueAfter = fieldApi.getValue()
    if (valueAfter !== valueBefore) {
      const [integer, fractional] = parseNumber(valueAfter, this.getRules().precision)
      // Handle a corner case for the satoshis. sat number must be integer so
      // explicitly getting rid of fractional part (to avoid things like "1000." )
      const isSats = ['sats', 'lits'].includes(currency)
      const formattedValue = formatValue(integer, isSats ? null : fractional)
      if (formattedValue !== valueAfter) {
        fieldApi.setValue(formattedValue)
      }
    }
  }

  getRules = () => {
    const { currency } = this.props
    switch (currency) {
      case 'btc':
      case 'ltc':
        return {
          precision: 8,
          placeholder: '0.00000000',
          pattern: '[0-9]*.?[0-9]{0,8}?',
        }
      case 'bits':
      case 'phots':
        return {
          precision: 2,
          placeholder: '0.00',
          pattern: '[0-9]*.?[0-9]{0,2}?',
        }
      case 'sats':
      case 'lits':
        return {
          precision: 0,
          placeholder: '00000000',
          pattern: '[0-9]*',
        }
      default:
        return {
          precision: 2,
          pattern: '[0-9]*',
        }
    }
  }

  render() {
    const rules = this.getRules()

    return (
      <Input {...this.props} pattern={rules.pattern} placeholder={rules.placeholder} type="text" />
    )
  }
}

const CryptoAmountInputAsField = CryptoAmountInput

class WrappedCryptoAmountInputAsField extends React.Component {
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
    return <CryptoAmountInputAsField validate={this.validate} {...this.props} />
  }
}

export default asField(withNumberInputMask(WrappedCryptoAmountInputAsField))
