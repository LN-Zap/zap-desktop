import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { FaBolt, FaChain } from 'react-icons/lib/fa'
import LoadingBolt from 'components/LoadingBolt'
import CurrencyIcon from 'components/CurrencyIcon'

import styles from './PayForm.scss'

class PayForm extends Component {
  componentDidUpdate(prevProps) {
    const {
      isOnchain, isLn, payform: { payInput }, fetchInvoice
    } = this.props

    // If on-chain, focus on amount to let user know it's editable
    if (isOnchain) { this.amountInput.focus() }

    // If LN go retrieve invoice details
    if ((prevProps.payform.payInput !== payInput) && isLn) {
      fetchInvoice(payInput)
    }
  }

  render() {
    const {
      payform: { amount, payInput, showErrors },
      currency,
      crypto,

      isOnchain,
      isLn,
      currentAmount,
      inputCaption,
      showPayLoadingScreen,
      payFormIsValid: { errors, isValid },

      setPayAmount,
      onPayAmountBlur,

      setPayInput,
      onPayInputBlur,

      onPaySubmit
    } = this.props

    return (
      <div className={styles.container}>
        {showPayLoadingScreen && <LoadingBolt />}

        <section className={`${styles.amountContainer} ${isLn ? styles.ln : ''} ${showErrors.amount && styles.error}`}>
          <section className={`${styles.amountError} ${showErrors.amount && styles.active}`}>
            {showErrors.amount &&
              <span>{errors.amount}</span>
            }
          </section>
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
                { width: `${amount.length > 1 ? (amount.length * 20) - 5 : 25}%`, fontSize: `${190 - (amount.length ** 2)}px` }
            }
            value={currentAmount}
            onChange={event => setPayAmount(event.target.value)}
            onBlur={onPayAmountBlur}
            id='amount'
            readOnly={isLn}
          />
        </section>
        <div className={styles.inputContainer}>
          <div className={styles.info}>
            <span>{inputCaption}</span>
          </div>
          <aside className={styles.paymentIcon}>
            {isOnchain &&
              <i>
                <span>on-chain</span>
                <FaChain />
              </i>
            }
            {isLn &&
              <i>
                <span>lightning network</span>
                <FaBolt />
              </i>
            }
          </aside>
          <section className={`${styles.input} ${showErrors.payInput && styles.error}`}>
            <input
              type='text'
              placeholder='Payment request or bitcoin address'
              value={payInput}
              onChange={event => setPayInput(event.target.value)}
              onBlur={onPayInputBlur}
              id='paymentRequest'
            />
          </section>
          <section className={`${styles.payInputError} ${showErrors.payInput && styles.active}`}>
            {showErrors.payInput &&
              <span>{errors.payInput}</span>
            }
          </section>
        </div>
        <section className={styles.buttonGroup}>
          <div className={`buttonPrimary ${styles.button} ${isValid && styles.active}`} onClick={onPaySubmit}>Pay</div>
        </section>
      </div>
    )
  }
}


PayForm.propTypes = {
  payform: PropTypes.shape({
    amount: PropTypes.string.isRequired,
    payInput: PropTypes.string.isRequired,
    showErrors: PropTypes.object.isRequired
  }).isRequired,
  currency: PropTypes.string.isRequired,
  crypto: PropTypes.string.isRequired,

  isOnchain: PropTypes.bool.isRequired,
  isLn: PropTypes.bool.isRequired,
  currentAmount: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  inputCaption: PropTypes.string.isRequired,
  showPayLoadingScreen: PropTypes.bool.isRequired,
  payFormIsValid: PropTypes.shape({
    errors: PropTypes.object,
    isValid: PropTypes.bool
  }).isRequired,

  setPayAmount: PropTypes.func.isRequired,
  onPayAmountBlur: PropTypes.func.isRequired,
  setPayInput: PropTypes.func.isRequired,
  onPayInputBlur: PropTypes.func.isRequired,
  fetchInvoice: PropTypes.func.isRequired,

  onPaySubmit: PropTypes.func.isRequired
}

export default PayForm
