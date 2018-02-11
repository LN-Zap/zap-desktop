import React from 'react'
import PropTypes from 'prop-types'
import CurrencyIcon from 'components/CurrencyIcon'
import styles from './RequestForm.scss'

class AmountInput extends React.Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  handleChange(e) {
    let value = e.target.value;
    let integer = null;
    let fractional = null;

    if (value.match(/[0-9]+/)) {
      integer = e.target.value * 1;
    }
    if (value.match(/[0-9]*[,\.][0-9]+/)) {
      [integer, fractional] = value.toString().split('.');
    }

    // limit fractional precision to 8 places
    if (fractional && fractional.length > 8) {
      console.log(e.target.selectionEnd)
      this.resetCursorPosition = e.target.selectionEnd
      
      fractional = fractional.substring(0, 8)
      value = `${integer}.${fractional}`
      console.log('SET VALUE', [integer, fractional])
    }

    if (value*1.0 < 0) {
      value = 0
    }

    this.props.onChange(value)
  }

  componentDidUpdate() {
    if (this.resetCursorPosition) {
      this.refs.input.setSelectionRange(this.resetCursorPosition, this.resetCursorPosition);
      this.resetCursorPosition = null;
    }
  }

  // TODO cleanup a little more
  shiftValue(value, delta) {
    let [integer, fractional] = value.toString().split('.')

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
      e.preventDefault();
      value = this.shiftValue(value, 1)
      this.props.onChange(value)
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      value = this.shiftValue(value, -1)
      this.props.onChange(value)
    }
  }

  render() {
    const {
      amount,
      currency,
      crypto,
    } = this.props;

    // TODO does not scale well
    let fontSize = 170 - (amount.length ** 2);
    if (fontSize < 30) {
      fontSize = 30
    }

    // for width to work, we need the font to be monospace or more margin for error
    const inputStyle = { 
      width: fontSize/1.5 * amount.length,
      fontSize: fontSize,
    }

    return (
      <section className={styles.amountContainer}>
        <label htmlFor='amount'>
          <CurrencyIcon currency={currency} crypto={crypto} />
        </label>
        <input
          ref='input'
          type='text'
          size=''
          style={inputStyle}
          value={amount}
          onKeyDown={this.handleKeyDown}
          onChange={this.handleChange}
          id='amount'
        />
      </section>
    )
  }
}

AmountInput.propTypes = {
  currency: PropTypes.string.isRequired,
  crypto: PropTypes.string.isRequired,
  onChange:PropTypes.func.isRequired,
  amount: PropTypes.string.isRequired,
}

export default AmountInput
