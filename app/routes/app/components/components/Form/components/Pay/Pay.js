import React from 'react'
import PropTypes from 'prop-types'
import { FaBolt, FaChain } from 'react-icons/lib/fa'
import CurrencyIcon from '../../../../../../../components/CurrencyIcon'
import { btc } from '../../../../../../../utils'
import styles from './Pay.scss'

const Pay = ({
  paymentType,
  setPaymentType,
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
      <div
        className={`${styles.onchain} ${paymentType === 'onchain' ? styles.active : null}`}
        onClick={() => setPaymentType('onchain')}
      >
        <aside className={`${styles.paymentIcon} ${styles.chain}`}>
          <span>on-chain</span>
          <FaChain />
        </aside>
        <section className={styles.inputContainer}>
          <label htmlFor='paymentRequest'>Address:</label>
          <input
            type='text'
            placeholder='Bitcoin address'
            value={payment_request}
            onChange={event => paymentRequestOnChange(event.target.value)}
            id='paymentRequest'
          />
        </section>
      </div>
      <div className={styles.divider} />
      <div
        className={`${styles.ln} ${paymentType === 'ln' ? styles.active : null}`}
        onClick={() => setPaymentType('ln')}
      >
        <aside className={`${styles.paymentIcon} ${styles.bolt}`}>
          <span>lightning network</span>
          <FaBolt />
        </aside>
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
      </div>
      <section className={styles.buttonGroup}>
        <div className={styles.button} onClick={payClicked}>
          Pay
        </div>
      </section>
    </div>
  )
}

Pay.propTypes = {
  amount: PropTypes.string.isRequired,
  setPaymentRequest: PropTypes.func.isRequired,
  fetchInvoice: PropTypes.func.isRequired,
  payInvoice: PropTypes.func.isRequired,
  currency: PropTypes.string.isRequired,
  crypto: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired
}

export default Pay
