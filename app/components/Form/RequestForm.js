import React from 'react'
import PropTypes from 'prop-types'
import CurrencyIcon from 'components/CurrencyIcon'
import styles from './RequestForm.scss'

const RequestForm = ({
  requestform: { amount, memo },
  currency,
  crypto,

  setRequestAmount,
  setRequestMemo,

  onRequestSubmit
}) => (
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
        onChange={event => setRequestAmount(event.target.value)}
        id='amount'
      />
    </section>
    <section className={styles.inputContainer}>
      <label htmlFor='memo'>
        Request:
      </label>
      <input
        type='text'
        placeholder='Dinner, Rent, etc'
        value={memo}
        onChange={event => setRequestMemo(event.target.value)}
        id='memo'
      />
    </section>
    <section className={styles.buttonGroup}>
      <div className={`buttonPrimary ${styles.button}`} onClick={onRequestSubmit}>
        Request
      </div>
    </section>
  </div>
)

RequestForm.propTypes = {
  requestform: PropTypes.object.isRequired,
  currency: PropTypes.string.isRequired,
  crypto: PropTypes.string.isRequired,

  setRequestAmount: PropTypes.func.isRequired,
  setRequestMemo: PropTypes.func.isRequired,

  onRequestSubmit: PropTypes.func.isRequired
}

export default RequestForm
