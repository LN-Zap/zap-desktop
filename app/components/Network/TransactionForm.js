import React from 'react'
import PropTypes from 'prop-types'
import styles from './TransactionForm.scss'

const TransactionForm = ({}) => (
  <div>
    <input 
      type='text'
      placeholder='payment request'
      className={styles.input}
    />

    <div className={styles.submitContainer}>
      <span className={styles.submit}>submit</span>
    </div>
  </div>
)

TransactionForm.propTypes = {
  
}

export default TransactionForm
