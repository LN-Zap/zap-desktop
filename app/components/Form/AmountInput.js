import React from 'react'
import PropTypes from 'prop-types'
import CurrencyIcon from 'components/CurrencyIcon'
import styles from './RequestForm.scss'

class AmountInput extends React.Component {
  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  parseNumber(_value) {
    let value = _value.replace(/[^0-9,.]/g, '')
    let integer = null
    let fractional = null

    if (value == '') { value = '0' }
    if (value*1.0 < 0) { value = '0.0' }

    // parse integer and fractional value so that we can reproduce
    // the same string value afterwards
    // [0, 0] == 0.0
    // [0, ''] == 0.
    // [0, null] == 0
    if (value.match(/^[0-9]*[.,][0-9]*$/)) {
      [integer, fractional] = value.toString().split(/[.,]/)
      if (!fractional) {
        fractional = ''
      }
    } else {
      integer = value
    }

    // limit fractional precision to 8 places (whole satoshis)
    if (fractional && fractional.length > 8) {
      fractional = fractional.substring(0, 8)
    }

    return [integer, fractional]
  }

  formatValue(integer, fractional) {
    let value
    if (fractional && fractional.length > 0) {
      value = `${integer}.${fractional}`
    } else { 
      // empty string means `XYZ.` instead of just plain `XYZ`
      if (fractional === '') {
        value = `${integer}.`
      } else {
        value = `${integer}`
      }
    }
    return value
  }

  handleChange(e) {
    const _value = e.target.value
    const [integer, fractional] = this.parseNumber(_value)
    let value = this.formatValue(integer, fractional)
    
    // reset cursor position here?
    if (value != _value) {
      this.resetCursorPosition = e.target.selectionEnd
    }

    this.props.onChange(value)
  }

  componentDidUpdate() {
    if (this.resetCursorPosition) {
      this.refs.input.setSelectionRange(this.resetCursorPosition, this.resetCursorPosition)
      this.resetCursorPosition = null
    }
  }

  shiftValue(value, delta) {
    let [integer, fractional] = this.parseNumber(value)

    if (fractional) {
      delta = delta / (10 ** fractional.length)
      value = (parseFloat(value) + delta).toFixed(fractional.length)
    } else {
      value = (integer*1 + delta).toString()
    }

    if (value < 0) { 
      if (fractional && fractional.length > 0) {
        value = (0.0).toFixed(fractional.length)
      } else {
        value = '0'
      }
    }

    return value
  }

  handleKeyDown(e) {
    let value = e.target.value

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      value = this.shiftValue(value, 1)
      this.props.onChange(value)
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      value = this.shiftValue(value, -1)
      this.props.onChange(value)
      return
    }

    // do not allow multiple commas or dots
    if ((e.key === '.') || (e.key === ',')) {
      if (value.search(/[.,]/) >= 0) {
        e.preventDefault()
      }
      return
    }

    if ((e.key.length == 1) && !e.key.match(/^[0-9.,]$/)) {
      e.preventDefault()
      return
    }
  }

  render() {
    const {
      amount,
      autoFocus,
      className,
      crypto,
      currency,
      inputClassName,
      onBlur,
      readOnly,
    } = this.props

    let fontSize = 170 - (amount.length ** 2)
    if (fontSize < 30) {
      fontSize = 30
    }

    // for width to work, we need the font to be monospace or more margin for error
    const inputStyle = { 
      width: fontSize/1.5 * amount.length,
      fontSize: fontSize,
    }

    return (
      <section className={className || styles.amountContainer}>
        <label htmlFor='amount'>
          <CurrencyIcon currency={currency} crypto={crypto} />
        </label>
        <input
          autoFocus={autoFocus}
          className={inputClassName}
          id='amount'
          onBlur={onBlur}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          readOnly={readOnly}
          ref='input'
          style={inputStyle}
          type='text'
          value={amount}
        />
      </section>
    )
  }
}

AmountInput.propTypes = {
  amount: PropTypes.string.isRequired,
  crypto: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
  onChange:PropTypes.func.isRequired
}

export default AmountInput
