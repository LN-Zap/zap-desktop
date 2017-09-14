import React from 'react'
import PropTypes from 'prop-types'
import { FaBolt, FaChain } from 'react-icons/lib/fa'
import CurrencyIcon from '../../../../../../../components/CurrencyIcon'
import { btc } from '../../../../../../../utils'
import styles from './Pay.scss'

const Pay = ({
  paymentType,
  setPaymentType,
  invoiceAmount,
  onchainAmount,
  setOnchainAmount,
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
    if (payreq.length === 124) {
      setPaymentType('ln')
      fetchInvoice(payreq) 
    } else if (payreq.length === 42) {
      setPaymentType('onchain')
    } else {
      setPaymentType('')
    }
  }
  
  const calculateAmount = value => (currency === 'usd' ? btc.satoshisToUsd(value, currentTicker.price_usd) : btc.satoshisToBtc(value))

  return (
    <div className={styles.container}>
      <section className={`${styles.amountContainer} ${paymentType === 'ln' ? styles.ln : ''}`}>
        <label htmlFor='amount'>
          <CurrencyIcon currency={currency} crypto={crypto} />
        </label>
        <input
          type='text'
          size=''
          style={
            paymentType === 'ln' ?
              { width: '75%', fontSize: '85px' }
              :
              { width: `${onchainAmount.length > 1 ? (onchainAmount.length * 15) - 5 : 25}%`, fontSize: `${190 - (onchainAmount.length ** 2)}px` }
          }
          value={paymentType === 'ln' ? calculateAmount(invoiceAmount) : onchainAmount}
          onChange={event => setOnchainAmount(event.target.value)}
          id='amount'
          readOnly={paymentType === 'ln'}
        />
      </section>
      <div className={styles.inputContainer}>
        <div className={styles.info}>
          {(() => {
            switch(paymentType) {
              case 'onchain':
                return (
                  <span>{`You're about to send ${onchainAmount} on-chain which should take around 10 minutes`}</span>
                )
              case 'ln':
                return (
                  <span>{`You're about to send ${calculateAmount(invoiceAmount)} over the Lightning Network which will be instant`}</span>
                )
              default:
                return null
            }
          })()}
        </div>
        <aside className={styles.paymentIcon}>
          {(() => {
            switch(paymentType) {
              case 'onchain':
                return (
                  <i>
                    <span>on-chain</span>
                    <FaChain />
                  </i>
                )
              case 'ln':
                return (
                  <i>
                    <span>lightning network</span>
                    <FaBolt />
                  </i>
                )
              default:
                return null
            }
          })()}
        </aside>
        <section className={styles.input}>
          <input
            type='text'
            placeholder='Payment request or bitcoin address'
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
  amount: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  setOnchainAmount: PropTypes.func.isRequired,
  setPaymentRequest: PropTypes.func.isRequired,
  fetchInvoice: PropTypes.func.isRequired,
  payInvoice: PropTypes.func.isRequired,
  currency: PropTypes.string.isRequired,
  crypto: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired
}

export default Pay
