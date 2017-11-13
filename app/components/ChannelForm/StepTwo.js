import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CurrencyIcon from 'components/CurrencyIcon'
import styles from './StepTwo.scss'

class StepTwo extends Component {
  render() {
    const { local_amt, setLocalAmount } = this.props

    return (
      <div className={styles.container}>
        <div className={styles.explainer}>
          <h2>Local Amount</h2>
          <p>
            Local amount is the amount of bitcoin that you would like to commit to the channel.
            This is the amount that will be sent in an on-chain transaction to open your Lightning channel.
          </p>
        </div>

        <form>
          <label htmlFor='amount'>
            <CurrencyIcon currency={'btc'} crypto={'btc'} />
          </label>
          <input
            type='number'
            min='0'
            max='0.16'
            ref={(input) => { this.input = input }}
            size=''
            value={local_amt}
            onChange={event => setLocalAmount(event.target.value)}
            id='amount'
            style={{ width: isNaN((local_amt.length + 1) * 55) ? 140 : (local_amt.length + 1) * 55 }}
          />
        </form>
      </div>
    )
  }
}

StepTwo.propTypes = {
  local_amt: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  setLocalAmount: PropTypes.func.isRequired
}

export default StepTwo
