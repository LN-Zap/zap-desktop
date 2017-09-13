import React from 'react'
import PropTypes from 'prop-types'
import CurrencyIcon from '../../../../../../../components/CurrencyIcon'
import { btc } from '../../../../../../../utils'
import styles from './Pay.scss'

const Pay = ({
  amount,
  payment_request,
  setPaymentRequest,
  fetchInvoice,
  payInvoice,
  currency,
  crypto,
  close
}) => {
  const payClicked = () => {
    if (payment_request.length !== 124) { return }

    payInvoice(payment_request)
    close()
  }

  const paymentRequestOnChange = payreq => {
    setPaymentRequest(payreq)
    if (payreq.length === 124) { fetchInvoice(payreq) }
  }
  
  const calculateAmount = value => (currency === 'usd' ? btc.satoshisToUsd(value, currentTicker.price_usd) : btc.satoshisToBtc(value))

  return (
    <div className={styles.container}>
      <section className={styles.amountContainer}>
        <label htmlFor='amount'>
          <CurrencyIcon currency={currency} crypto={crypto} />
        </label>
        <input
          type='text'
          size=''
          style={{ width: '75%', fontSize: '85px' }}
          value={calculateAmount(amount)}
          id='amount'
          readOnly
        />
      </section>
      <section className={styles.inputContainer}>
        <label htmlFor='paymentRequest'>Request:</label>
        <input
          type='text'
          placeholder='Payment Request'
          value={payment_request}
          onChange={event => paymentRequestOnChange(event.target.value)}
          id='paymentRequest'
        />
      </section>
      <section className={styles.buttonGroup}>
        <div className={styles.button} onClick={payClicked}>
          Pay
        </div>
      </section>
    </div>
  )
}

Pay.propTypes = {}

export default Pay
