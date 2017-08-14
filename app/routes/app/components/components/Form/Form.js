// @flow
import React, { Component } from 'react'
import { FaDollar, FaBitcoin } from 'react-icons/lib/fa'
import { MdArrowBack, MdClose } from 'react-icons/lib/md'
import { btc } from '../../../../../utils'
import styles from './Form.scss'

class Form extends Component {
  render() {
    const { 
      form: { formType, amount, message, pubkey, payment_request },
      setAmount,
      setMessage,
      setPubkey,
      setPaymentRequest,
      ticker: { currency, btcTicker },
      isOpen,
      close,
      createInvoice,
      payInvoice,
      fetchInvoice,
      formInvoice
    } = this.props

    const requestClicked = () => {
      createInvoice(amount, message, currency, btcTicker.price_usd)
      .then(success => {
        if (success) { close() }
      })
    }

    const payClicked = () => {
      payInvoice(payment_request)
      .then(success => {
        console.log('success: ', success)
        if (success) { close() }
      })
    }

    const paymentRequestOnChange = (payreq) => {
      setPaymentRequest(payreq)
      if (payreq.length === 124) { fetchInvoice(payreq) }
    }

    const calculateAmount = (amount) => currency === 'btc' ? btc.satoshisToBtc(amount) : btc.satoshisToUsd(amount, btcTicker.price_usd)

    return (
      <div className={`${styles.formContainer} ${isOpen ? styles.open : ''}`}>
        <div className={styles.container}>
          <div className={styles.esc} onClick={close}>
            <MdClose />
          </div>
          <div className={styles.content}>
            <section className={styles.amountContainer}>
              <label>
                {
                  currency === 'btc' ?
                    <FaBitcoin />
                  :
                    <FaDollar />
                }
              </label>
              <input
                type='text'
                size=''
                style={
                  formType === 'pay' ?
                    { width: '75%', fontSize: '100px' }
                  :
                    { width: `${amount.length > 1 ? (amount.length * 15) - 5 : 25}%`, fontSize: `${190 - (amount.length ** 2)}px` }
                }
                value={formType === 'pay' ? calculateAmount(formInvoice.amount) : amount}
                onChange={(event) => setAmount(event.target.value)}
                readOnly={formType === 'pay'}
              />
            </section>
            {
              formType === 'pay' ?
                <section className={styles.inputContainer}>
                  <label>Request:</label>
                  <input
                    type='text'
                    placeholder='Payment Request'
                    value={payment_request}
                    onChange={(event) => paymentRequestOnChange(event.target.value)}
                  />
                </section>
              :
                <section className={styles.inputContainer}>
                  <label>For:</label>
                  <input
                    type='text'
                    placeholder='Dinner, Rent, etc'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </section>
            }
            {
              formType === 'pay' ? 
                <section className={styles.buttonGroup}>
                  <div className={styles.button} onClick={payClicked}>
                    Pay
                  </div>
                </section>
              :
                <section className={styles.buttonGroup}>
                  <div  className={styles.button} onClick={requestClicked}>
                    Request
                  </div>
                </section>
            }
          </div>
        </div>
      </div>
    )
  }
}

Form.propTypes = {}

export default Form