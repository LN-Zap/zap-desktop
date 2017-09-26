import React from 'react'
import PropTypes from 'prop-types'
import CurrencyIcon from 'components/CurrencyIcon'
import styles from './Request.scss'

const Request = ({
  amount,
  setAmount,
  setMessage,
  createInvoice,
  message,
  currentTicker,
  currency,
  crypto,
  close
}) => {
  const requestClicked = () => {
    createInvoice(amount, message, currency, currentTicker.price_usd)
    close()
  }

  return (
    <div className={styles.container}>
      <section className={styles.amountContainer}>
        <label htmlFor='amount'>
          <CurrencyIcon currency={currency} crypto={crypto} />
        </label>
        <input
          type='text'
          size=''
          style={{ width: `${amount.length > 1 ? (amount.length * 15) - 5 : 25}%`, fontSize: `${190 - (amount.length ** 2)}px` }}
          value={amount}
          onChange={event => setAmount(event.target.value)}
          id='amount'
        />
      </section>
      <section className={styles.inputContainer}>
        <label htmlFor='paymentRequest'>Request:</label>
        <input
          type='text'
          placeholder='Dinner, Rent, etc'
          value={message}
          onChange={event => setMessage(event.target.value)}
          id='paymentRequest'
        />
      </section>
      <section className={styles.buttonGroup}>
        <div className={styles.button} onClick={requestClicked}>
          Request
        </div>
      </section>
    </div>
  )
}

Request.propTypes = {
  amount: PropTypes.string.isRequired,
  setAmount: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  createInvoice: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  currentTicker: PropTypes.object.isRequired,
  currency: PropTypes.string.isRequired,
  crypto: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired
}

export default Request
