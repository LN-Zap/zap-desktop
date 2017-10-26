import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CurrencyIcon from 'components/CurrencyIcon'
import styles from './StepThree.scss'

class StepThree extends Component {
  render() {
    const { push_amt, setPushAmount } = this.props

    return (
      <div className={styles.container}>
        <div className={styles.explainer}>
          <h2>Push Amount</h2>
          <p>The push amount is the amount of bitcoin (if any at all) you'd like to "push" to the other side of the channel when it opens. This amount will set on the remote side as part of the initial commitment state.</p>
        </div>

        <form>
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
            value={push_amt}
            onChange={event => setPushAmount(event.target.value)}
            id='amount'
            style={{ width: isNaN((push_amt.length + 1) * 55) ? 140 : (push_amt.length + 1) * 55 }}
          />
        </form>
      </div>
    )
  }
}

StepThree.propTypes = {}

export default StepThree
