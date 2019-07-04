/* eslint-disable react/no-multi-comp */

import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { asField } from 'informed'
import * as yup from 'yup'
import { withInputValidation, withNumberInputMask } from 'hocs'
import { convert } from '@zap/utils/btc'
import { formatValue, parseNumber } from '@zap/utils/crypto'
import { BasicInput } from './Input'

class CryptoAmountInput extends React.Component {
  static propTypes = {
    cryptoUnit: PropTypes.string.isRequired,
    fieldApi: PropTypes.object.isRequired,
    fieldState: PropTypes.object.isRequired,
    isRequired: PropTypes.bool,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
  }

  componentDidUpdate(prevProps) {
    const { cryptoUnit, fieldApi, fieldState } = this.props
    // Reformat the value when the currency unit has changed.
    if (cryptoUnit !== prevProps.cryptoUnit) {
      const { fieldApi } = this.props
      let { value } = fieldState
      const convertedValue = convert(prevProps.cryptoUnit, cryptoUnit, value)
      const [integer, fractional] = parseNumber(convertedValue, this.getRules().precision)
      value = formatValue(integer, fractional)
      fieldApi.setValue(value)
    }

    // If the value has changed, reformat it if needed.
    const valueBefore = prevProps.fieldState.value
    const valueAfter = fieldState.value
    if (valueAfter !== valueBefore) {
      const [integer, fractional] = parseNumber(valueAfter, this.getRules().precision)
      // Handle a corner case for the satoshis. sat number must be integer so
      // explicitly getting rid of fractional part (to avoid things like "1000." )
      const isSats = ['sats', 'lits'].includes(cryptoUnit)
      const formattedValue = formatValue(integer, isSats ? null : fractional)
      if (formattedValue !== valueAfter) {
        fieldApi.setValue(formattedValue)
      }
    }
  }

  getRules = () => {
    const { cryptoUnit } = this.props
    switch (cryptoUnit) {
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
      <BasicInput
        {...this.props}
        pattern={rules.pattern}
        placeholder={rules.placeholder}
        type="text"
      />
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

const BasicCryptoAmountInput = withNumberInputMask(WrappedCryptoAmountInputAsField)
export { WrappedCryptoAmountInputAsField as BasicCryptoAmountInput }

export default compose(
  withInputValidation,
  asField
)(BasicCryptoAmountInput)
