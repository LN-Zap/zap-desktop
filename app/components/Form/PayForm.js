import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { FaBolt, FaChain } from 'react-icons/lib/fa'
import LoadingBolt from 'components/LoadingBolt'
import CurrencyIcon from 'components/CurrencyIcon'

import styles from './PayForm.scss'

class PayForm extends Component {
  componentDidUpdate(prevProps) {
    const { isOnchain, isLn, payform: { payInput }, fetchInvoice } = this.props

    // If on-chain, focus on amount to let user know it's editable
    if (isOnchain) { this.amountInput.focus() }
    // If LN go retrieve invoice details
    if ((prevProps.payform.payInput !== payInput) && isLn) {
      fetchInvoice(payInput)
    }
  }

  render() {
    const {
      payform: { amount, payInput, invoice },
      currency,
      crypto,
      
      isOnchain,
      isLn,
      currentAmount,
      inputCaption,
      showPayLoadingScreen,

      setPayAmount,
      setPayInput,

      onPaySubmit
    } = this.props

    return (
      <div className={styles.container}>
        {showPayLoadingScreen && <LoadingBolt />}
        
        <section className={`${styles.amountContainer} ${isLn ? styles.ln : ''}`}>
          <label htmlFor='amount'>
            <CurrencyIcon currency={currency} crypto={crypto} />
          </label>
          <input
            type='number'
            min='0'
            ref={input => this.amountInput = input} // eslint-disable-line
            size=''
            style={
              isLn ?
                { width: '75%', fontSize: '85px' }
                :
                { width: `${amount.length > 1 ? (amount.length * 15) - 5 : 25}%`, fontSize: `${190 - (amount.length ** 2)}px` }
            }
            value={currentAmount}
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
              value={payInput}
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
