// @flow
import React, { Component } from 'react'
import { FaDollar, FaBitcoin } from 'react-icons/lib/fa'
import { MdArrowBack, MdClose } from 'react-icons/lib/md'
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
      createInvoice
    } = this.props

    const requestClicked = () => {
      createInvoice(amount, message, currency, btcTicker.price_usd)
      .then(success => {
        if (success) { close() }
      })
    }

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
                style={{ width: `${(amount.length * 20) + 10}%`, fontSize: `${190 - (amount.length ** 2)}px` }}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                ref={input => input && input.focus()}
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
                    onChange={(e) => setPaymentRequest(e.target.value)}
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
                  <div className={styles.button}>Pay</div>
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