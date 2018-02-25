import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { FaBolt, FaChain } from 'react-icons/lib/fa'
import LoadingBolt from 'components/LoadingBolt'
import CurrencyIcon from 'components/CurrencyIcon'
import AmountInput from './AmountInput'

import styles from './PayForm.scss'

class PayForm extends Component {
  componentDidUpdate(prevProps) {
    const {
      isLn, payform: { payInput }, fetchInvoice
    } = this.props

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
        <AmountInput
          amount={currentAmount}
          className={`${styles.amountContainer} ${isLn ? styles.ln : ''} ${showErrors.amount && styles.error}`}
          currency={currency}
          crypto={crypto}
          onChange={setPayAmount}
          onBlur={onPayAmountBlur}
          readOnly={isLn}
          autoFocus={isOnchain}
        />
        <section className={`${styles.errorMessage} ${showErrors.amount && styles.active}`}>
          {showErrors.amount &&
            <span>{errors.amount}</span>
          }
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
          <section className={`${styles.errorMessage} ${showErrors.payInput && styles.active}`}>
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
