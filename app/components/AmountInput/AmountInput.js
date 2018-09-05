import React from 'react'
import PropTypes from 'prop-types'

class AmountInput extends React.Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.textInput = React.createRef()
  }

  setRules() {
    const { currency } = this.props
    switch (currency) {
      case 'btc':
        this.rules = {
          precision: 8,
          placeholder: '0.00000000',
          pattern: '[0-9.]*'
        }
        break
      case 'bits':
        this.rules = {
          precision: 2,
          placeholder: '0.00',
          pattern: '[0-9.]*'
        }
        break
      case 'sats':
        this.rules = {
          precision: 0,
          placeholder: '00000000',
          pattern: '[0-9]*'
        }
        break
      default:
        this.rules = {
          precision: 2,
          pattern: '[0-9]*'
        }
    }
  }

  focusTextInput() {
    this.textInput.current.focus()
  }

  parseNumber(_value) {
    let value = _value || ''
    if (typeof _value === 'string') {
      value = _value.replace(/[^0-9.]/g, '')
    }
    let integer = null
    let fractional = null
    if (value * 1.0 < 0) {
      value = '0.0'
    }
    // pearse integer and fractional value so that we can reproduce the same string value afterwards
    // [0, 0] === 0.0
    // [0, ''] === 0.
    // [0, null] === 0
    if (value.match(/^[0-9]*\.[0-9]*$/)) {
      ;[integer, fractional] = value.toString().split(/\./)
      if (!fractional) {
        fractional = ''
      }
    } else {
      integer = value
    }
    // Limit fractional precision to the correct number of decimal places.
    if (fractional && fractional.length > this.rules.precision) {
      fractional = fractional.substring(0, this.rules.precision)
    }

    return [integer, fractional]
  }

  formatValue(integer, fractional) {
    let value
    if (fractional && fractional.length > 0) {
      value = `${integer}.${fractional}`
    } else {
      // Empty string means `XYZ.` instead of just plain `XYZ`.
      if (fractional === '') {
        value = `${integer}.`
      } else {
        value = `${integer}`
      }
    }
    return value
  }

  handleChange(e) {
    let { value } = e.target
    const [integer, fractional] = this.parseNumber(value)
    value = this.formatValue(integer, fractional)

    const { onChangeEvent } = this.props
    if (onChangeEvent) {
      onChangeEvent(value)
    }
  }

  handleBlur(e) {
    let { value } = e.target
    const [integer, fractional] = this.parseNumber(value)
    value = this.formatValue(integer, fractional)

    const { onBlurEvent } = this.props
    if (onBlurEvent) {
      onBlurEvent(value)
    }
  }

  handleKeyDown(e) {
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
    let { amount = '', readOnly } = this.props
    if (amount === null) {
      amount = ''
    }
    this.setRules()

    return (
      <input
        id="amount"
        onChange={this.handleChange}
        onBlur={this.handleBlur}
        onKeyDown={this.handleKeyDown}
        readOnly={readOnly}
        ref={this.textInput}
        type="text"
        required
        value={amount}
        pattern={this.rules.pattern}
        placeholder={this.rules.placeholder}
      />
    )
  }
}

AmountInput.propTypes = {
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  currency: PropTypes.string.isRequired,
  onChangeEvent: PropTypes.func,
  onBlurEvent: PropTypes.func,
  readOnly: PropTypes.bool
}

export default AmountInput
