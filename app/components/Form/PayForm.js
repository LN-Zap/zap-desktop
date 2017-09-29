import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { FaBolt, FaChain } from 'react-icons/lib/fa'
import CurrencyIcon from 'components/CurrencyIcon'

import styles from './PayForm.scss'

class PayForm extends Component {
  componentDidUpdate(prevProps) {
    const { isOnchain, isLn, payform: { payInput } } = this.props

    if (isOnchain) { this.amountInput.focus() }
    if ((prevProps.payInput !== payInput) && isLn) {
      console.log('go get the invoice')
    }
  }

  render() {
    const {
      payform,
      currency,
      crypto,
      isOnchain,
      isLn,
      inputCaption,
      setPayAmount,
      setPayInput,
      onPaySubmit
    } = this.props

    console.log('inputCaption: ', inputCaption)
    return (
      <div className={styles.container}>
        <section className={`${styles.amountContainer} ${isLn ? styles.ln : ''}`}>
          <label htmlFor='amount'>
            <CurrencyIcon currency={currency} crypto={crypto} />
          </label>
          <input
            type='text'
            ref={input => this.amountInput = input} // eslint-disable-line
            size=''
            style={
              isLn ?
                { width: '75%', fontSize: '85px' }
                :
                { width: `${payform.amount.length > 1 ? (payform.amount.length * 15) - 5 : 25}%`, fontSize: `${190 - (payform.amount.length ** 2)}px` }
            }
            value={payform.amount}
            onChange={event => setPayAmount(event.target.value)}
            id='amount'
            readOnly={isLn}
          />
        </section>
        <div className={styles.inputContainer}>
          <div className={styles.info}>
            <span>{inputCaption}</span>
          </div>
          <aside className={styles.paymentIcon}>
            {(() => {
              if (isOnchain) {
                return (
                  <i>
                    <span>on-chain</span>
                    <FaChain />
                  </i>
                )
              } else if (isLn) {
                return (
                  <i>
                    <span>lightning network</span>
                    <FaBolt />
                  </i>
                )
              }
              return null
            })()}
          </aside>
          <section className={styles.input}>
            <input
              type='text'
              placeholder='Payment request or bitcoin address'
              value={payform.payInput}
              onChange={event => setPayInput(event.target.value)}
              id='paymentRequest'
            />
          </section>
        </div>
        <section className={styles.buttonGroup}>
          <div className={styles.button} onClick={onPaySubmit}>Pay</div>
        </section>
      </div>
    )
  }
}


PayForm.propTypes = {
  
}

export default PayForm
