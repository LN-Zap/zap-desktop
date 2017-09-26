import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FaBolt, FaChain } from 'react-icons/lib/fa'
import CurrencyIcon from 'components/CurrencyIcon'
import LoadingBolt from 'components/LoadingBolt'
import { btc } from 'utils'
import styles from './Pay.scss'

class Pay extends Component {
  componentDidUpdate(prevProps) {
    const { isOnchain, isLn, fetchInvoice, payment_request } = this.props

    if (isOnchain) { this.amountInput.focus() }
    if ((prevProps.payment_request !== payment_request) && isLn) { fetchInvoice(payment_request) }
  }

  render() {
    const {
      sendingTransaction,
      invoiceAmount,
      onchainAmount,
      setOnchainAmount,
      payment_request,
      setPaymentRequest,
      payInvoice,
      sendCoins,
      currentTicker,
      currency,
      crypto,
      isOnchain,
      isLn
    } = this.props

    const payClicked = () => {
      if (!isOnchain && !isLn) { return }

      if (isOnchain) { sendCoins({ value: onchainAmount, addr: payment_request, currency, rate: currentTicker.price_usd }) }
      if (isLn) { payInvoice(payment_request) }
    }

    const calculateAmount = value => (currency === 'usd' ? btc.satoshisToUsd(value, currentTicker.price_usd) : btc.satoshisToBtc(value))

    return (
      <div>
        {
          sendingTransaction ?
            <LoadingBolt />
            :
            null

        }
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
                  { width: `${onchainAmount.length > 1 ? (onchainAmount.length * 15) - 5 : 25}%`, fontSize: `${190 - (onchainAmount.length ** 2)}px` }
              }
              value={isLn ? calculateAmount(invoiceAmount) : onchainAmount}
              onChange={event => setOnchainAmount(event.target.value)}
              id='amount'
              readOnly={isLn}
            />
          </section>
          <div className={styles.inputContainer}>
            <div className={styles.info}>
              {(() => {
                if (isOnchain) {
                  return (
                    <span>{`You're about to send ${onchainAmount} ${currency.toUpperCase()} on-chain which should take around 10 minutes`}</span>
                  )
                } else if (isLn) {
                  return (
                    <span>{`You're about to send ${calculateAmount(invoiceAmount)} ${currency.toUpperCase()} over the Lightning Network which will be instant`}</span> // eslint-disable-line
                  )
                }
                return null
              })()}
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
                value={payment_request}
                onChange={event => setPaymentRequest(event.target.value)}
                id='paymentRequest'
              />
            </section>
          </div>
          <section className={styles.buttonGroup}>
            <div className={styles.button} onClick={payClicked}>
              Pay
            </div>
          </section>
        </div>
      </div>
    )
  }
}

Pay.propTypes = {
  sendingTransaction: PropTypes.bool.isRequired,
  invoiceAmount: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  onchainAmount: PropTypes.string.isRequired,
  setOnchainAmount: PropTypes.func.isRequired,
  payment_request: PropTypes.string.isRequired,
  setPaymentRequest: PropTypes.func.isRequired,
  fetchInvoice: PropTypes.func.isRequired,
  payInvoice: PropTypes.func.isRequired,
  sendCoins: PropTypes.func.isRequired,
  currentTicker: PropTypes.object.isRequired,
  currency: PropTypes.string.isRequired,
  crypto: PropTypes.string.isRequired,
  isOnchain: PropTypes.bool.isRequired,
  isLn: PropTypes.bool.isRequired
}

export default Pay
