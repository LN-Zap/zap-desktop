/* eslint-disable react/no-multi-comp */

import React from 'react'
import PropTypes from 'prop-types'
import { asField } from 'informed'
import * as yup from 'yup'
import { convert } from 'lib/utils/btc'
import { formatValue, parseNumber } from 'lib/utils/crypto'
import Input from 'components/UI/Input'

/**
 * @render react
 * @name CryptoAmountInput
 */
class CryptoAmountInput extends React.Component {
  static propTypes = {
    currency: PropTypes.string.isRequired,
    required: PropTypes.bool,
    onChange: PropTypes.func,
    onBlur: PropTypes.func
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
      const formattedValue = formatValue(integer, fractional)
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
          pattern: '[0-9]*.?[0-9]{0,8}?'
        }
      case 'bits':
      case 'phots':
        return {
          precision: 2,
          placeholder: '0.00',
          pattern: '[0-9]*.?[0-9]{0,2}?'
        }
      case 'sats':
      case 'lits':
        return {
          precision: 0,
          placeholder: '00000000',
          pattern: '[0-9]*'
        }
      default:
        return {
          precision: 2,
          pattern: '[0-9]*'
        }
    }
  }

  handleKeyDown = e => {
    // Do nothing if the user did select all key combo.
    if (e.metaKey && e.key === 'a') {
      return
    }

    // Do not allow multiple dots.
    let { value } = e.target
    if (e.key === '.') {
      if (value.search(/\./) >= 0) {
        e.preventDefault()
      }
      return
    }

    if (e.key.length === 1 && !e.key.match(/^[0-9.]$/)) {
      e.preventDefault()
      return
    }
  }

  render() {
    const rules = this.getRules()
    return (
      <Input
        {...this.props}
        type="text"
        placeholder={rules.placeholder}
        pattern={rules.pattern}
        onKeyDown={this.handleKeyDown}
      />
    )
  }
}

const CryptoAmountInputAsField = asField(CryptoAmountInput)

class WrappedCryptoAmountInputAsField extends React.Component {
  validate = value => {
    const { disabled, required } = this.props
    if (disabled) {
      return
    }
    try {
      let validator = yup
        .number()
        .positive()
        .min(0)
        .typeError('A number is required')
      if (required) {
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

export default WrappedCryptoAmountInputAsField
