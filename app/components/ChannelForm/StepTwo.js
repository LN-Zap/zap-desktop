import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AutosizeInput from 'react-input-autosize'
import CurrencyIcon from 'components/CurrencyIcon'
import styles from './StepTwo.scss'

class StepTwo extends Component {
  render() {
    const { local_amt, setLocalAmount } = this.props
    console.log('local_amt: ', local_amt)
    return (
      <div className={styles.container}>
        <label htmlFor='amount'>
          <CurrencyIcon currency={'btc'} crypto={'btc'} />
        </label>
        <input
          autoFocus
          type='number'
          min='0'
          max='0.16'
          ref={input => this.input = input}
          size=''
          value={local_amt}
          onChange={event => setLocalAmount(event.target.value)}
          id='amount'
          style={{ width: isNaN((local_amt.length + 1) * 55) ? 140 : (local_amt.length + 1) * 55 }}
        />
      </div>
    )
  }
}

StepTwo.propTypes = {}

export default StepTwo
