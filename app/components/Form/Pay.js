import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Isvg from 'react-inlinesvg'
import paperPlane from 'icons/paper_plane.svg'

import { FaBolt, FaChain, FaAngleDown } from 'react-icons/lib/fa'
import LoadingBolt from 'components/LoadingBolt'
import CurrencyIcon from 'components/CurrencyIcon'

import styles from './Pay.scss'

class Pay extends Component {
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
      usdAmount,
      inputCaption,
      showPayLoadingScreen,
      payFormIsValid: { errors, isValid },

      setPayAmount,
      onPayAmountBlur,

      setPayInput,
      onPayInputBlur,

      onPaySubmit
    } = this.props

    console.log('usdAmount: ', usdAmount)

    return (
      <div className={styles.container}>
        {showPayLoadingScreen && <LoadingBolt />}
        <header className={styles.header}>
          <Isvg src={paperPlane} />
          <h1>Make Payment</h1>
        </header>

        <div className={styles.content}>
          <section className={styles.destination}>
            <div className={styles.top}>
              <label htmlFor='destination'>Destination</label>
              <span>
              </span>
            </div>
            <div className={styles.bottom}>
              <textarea
                type='text'
                placeholder='Payment request or bitcoin address'
                value={payInput}
                onChange={event => setPayInput(event.target.value)}
                onBlur={onPayInputBlur}
                id='destination'
                rows='4'
              />
            </div>
          </section>

          <section className={styles.amount}>
            <div className={styles.top}>
              <label>Amount</label>
              <span></span>
            </div>
            <div className={styles.bottom}>
              <input
                type='number'
                min='0'
                ref={(input) => { this.amountInput = input }}
                size=''
                placeholder='0.00000000'
                value={currentAmount || ''}
                onChange={event => setPayAmount(event.target.value)}
                onBlur={onPayAmountBlur}
                id='amount'
                readOnly={isLn}
              />
              <div className={styles.currency}>
                <section className={styles.currentCurrency}>
                  <span>BTC</span><span><FaAngleDown /></span>
                </section>
                <ul>
                  <li>Bits</li>
                  <li>Satoshis</li>
                </ul>
              </div>
            </div>

            <div className={styles.usdAmount}>
              {`≈ ${usdAmount} USD`}
            </div>
          </section>

          <section className={styles.submit}>
            <div className={`${styles.button} ${isValid && styles.active}`} onClick={onPaySubmit}>Pay</div>
          </section>
        </div>
      </div>
    )
  }
}


Pay.propTypes = {
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
  ]),
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

export default Pay
