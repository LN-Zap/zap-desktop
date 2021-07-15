import React from 'react'

import { asField } from 'informed'
import PropTypes from 'prop-types'
import { compose } from 'redux'

import { convert } from '@zap/utils/btc'
import { formatValue, parseNumber } from '@zap/utils/crypto'
import { withNumberInputMask, withNumberValidation } from 'hocs'

import { BasicInput } from './Input'

/**
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
    const { currency, currentTicker, fieldApi, fieldState } = this.props

    // Reformat the value when the currency unit has changed.
    if (currency !== prevProps.currency) {
      let { value } = fieldState
      const lastPriceInOrigCurrency = currentTicker[prevProps.currency]
      const lastPriceInNewCurrency = currentTicker[currency]
      // Convert to BTC.
      const btcValue = convert('fiat', 'btc', value, lastPriceInOrigCurrency)
      // Convert to new currency.
      const newFiatValue = convert('btc', 'fiat', btcValue, lastPriceInNewCurrency)
      const [integer, fractional] = parseNumber(newFiatValue, FiatAmountInput.getRules().precision)
      value = formatValue(integer, fractional)
      fieldApi.setValue(value)
    }

    // If the value has changed, reformat it if needed.
    const valueBefore = prevProps.fieldState.value
    const valueAfter = fieldState.value

    if (valueAfter !== valueBefore) {
      const [integer, fractional] = parseNumber(valueAfter, FiatAmountInput.getRules().precision)
      const formattedValue = formatValue(integer, fractional)
      if (formattedValue !== valueAfter) {
        fieldApi.setValue(formattedValue)
      }
    }
  }

  static getRules() {
    return {
      precision: 2,
      step: '0.01',
      placeholder: '0.00',
      pattern: '[0-9]*.?[0-9]{0,2}?',
    }
  }

  render() {
    const rules = FiatAmountInput.getRules()
    return (
      <BasicInput
        {...this.props}
        pattern={rules.pattern}
        placeholder={rules.placeholder}
        step={rules.step}
        type="number"
      />
    )
  }
}

const FiatAmountInputAsField = compose(
  withNumberValidation,
  asField,
  withNumberInputMask
)(FiatAmountInput)

// Wrap the select field to apply conditional validation.
const WrappedFiatAmountInputAsField = props => {
  const { isRequired } = props

  return <FiatAmountInputAsField moreThan={isRequired ? 0 : null} {...props} />
}

WrappedFiatAmountInputAsField.propTypes = {
  isRequired: PropTypes.bool,
}

export default WrappedFiatAmountInputAsField
