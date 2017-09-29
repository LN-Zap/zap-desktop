import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './PayForm.scss'

class PayForm extends Component {
  render() {
    const {
      payform,
      isOnchain,
      isLn,
      inputCaption,
      setPayAmount,
      setPayInput,
      onPaySubmit
    } = this.props

    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <section className={`${styles.amountContainer} ${isLn ? styles.ln : ''}`}>
            <input
              type='text'
              ref={input => this.amountInput = input} // eslint-disable-line
              size=''
              style={
                isLn ?
                  { width: '75%', fontSize: '85px' }
                  :
                  { width: `${amount.length > 1 ? (amount.length * 15) - 5 : 25}%`, fontSize: `${190 - (amount.length ** 2)}px` }
              }
              value={payform.amount}
              onChange={event => setPayAmount(event.target.value)}
              id='amount'
              readOnly={isLn}
            />
          </section>
          <div className={styles.inputContainer}>
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
      </div>
    )
  }
}


PayForm.propTypes = {
  
}

export default PayForm
