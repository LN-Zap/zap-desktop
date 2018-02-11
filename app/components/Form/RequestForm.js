import React from 'react'
import PropTypes from 'prop-types'
import CurrencyIcon from 'components/CurrencyIcon'
import styles from './RequestForm.scss'
import AmountInput from './AmountInput'

const RequestForm = ({
  requestform: { amount, memo },
  currency,
  crypto,

  setRequestAmount,
  setRequestMemo,

  onRequestSubmit
}) => (
  <div className={styles.container}>
    <AmountInput
      amount={amount}
      currency={currency}
      crypto={crypto}
      onChange={setRequestAmount}
    />
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
  requestform: PropTypes.shape({
    amount: PropTypes.string.isRequired,
    memo: PropTypes.string
  }).isRequired,
  currency: PropTypes.string.isRequired,
  crypto: PropTypes.string.isRequired,

  setRequestAmount: PropTypes.func.isRequired,
  setRequestMemo: PropTypes.func.isRequired,

  onRequestSubmit: PropTypes.func.isRequired
}

export default RequestForm
