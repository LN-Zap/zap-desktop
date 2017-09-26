import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'
import 'moment-timezone'
import { FaChain } from 'react-icons/lib/fa'
import { btc } from 'utils'
import styles from '../Activity.scss'

const Transaction = ({ transaction, ticker, currentTicker, showActivityModal }) => (
  <div className={styles.container} onClick={() => showActivityModal('TRANSACTION', { transaction })}>
    <div className={styles.date}>
      <Moment format='D'>
        {transaction.time_stamp * 1000}
      </Moment>
      <Moment format='MMMM'>
        {transaction.time_stamp * 1000}
      </Moment>
    </div>
    <div className={styles.data}>
      <div className={styles.title}>
        <i className={`${styles.icon} hint--top`} data-hint='On-chain transaction'>
          <FaChain />
        </i>
        <h3>
          { transaction.amount > 0 ? 'Received' : 'Sent' }
        </h3>
        <span>
          {ticker.currency}
        </span>
      </div>
      <div className={styles.subtitle}>
        {transaction.tx_hash}
      </div>
    </div>
    <div className={`${styles.amount} ${transaction.amount > 0 ? styles.positive : styles.negative}`}>
      <span className='hint--top' data-hint='Transaction amount'>
        { transaction.amount > 0 ? '+' : '' }
        {
          ticker.currency === 'usd' ?
            btc.satoshisToUsd(transaction.amount, currentTicker.price_usd)
            :
            btc.satoshisToBtc(transaction.amount)
        }
      </span>
      <span className='hint--bottom' data-hint='Transaction fee'>
        {
          ticker.currency === 'usd' ?
            btc.satoshisToUsd(transaction.total_fees, currentTicker.price_usd)
            :
            btc.satoshisToBtc(transaction.total_fees)
        }
      </span>
    </div>
  </div>
)

Transaction.propTypes = {
  transaction: PropTypes.object.isRequired,
  ticker: PropTypes.object.isRequired,
  currentTicker: PropTypes.object.isRequired,
  showActivityModal: PropTypes.func.isRequired
}

export default Transaction
