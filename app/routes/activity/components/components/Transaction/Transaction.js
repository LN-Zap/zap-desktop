import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'
import 'moment-timezone'
import { FaChain } from 'react-icons/lib/fa'
import { btc } from '../../../../../utils'
import CurrencyIcon from '../../../../../components/CurrencyIcon'
import styles from './Transaction.scss'

const Transaction = ({ transaction, ticker, currentTicker }) => (
  <div className={styles.container}>
    <i className={`${styles.icon} hint--top`} data-hint='On-chain transaction'>
      <FaChain />
    </i>
    <div className={styles.data}>
      <div className={styles.title}>
        {transaction.tx_hash}
      </div>
      <div className={styles.subtitle}>
        {transaction.num_confirmations} confirmations
      </div>
    </div>
    <div className={styles.date}>
      <Moment format='MMM Do'>{transaction.time_stamp * 1000}</Moment>
    </div>
    <div className={`${styles.amount} ${transaction.amount < 0 ? styles.negative : styles.positive}`}>
      <section>
        <CurrencyIcon
          currency={ticker.currency}
          crypto={ticker.crypto}
          styles={{ verticalAlign: 'top', width: '24px' }}
        />
      </section>
      <section>
        <span className='hint--top' data-hint='Transaction amount'>
          {
            ticker.currency === 'usd' ?
              btc.satoshisToUsd(transaction.amount, currentTicker.price_usd)
              :
              btc.satoshisToBtc(transaction.amount)
          }
        </span>
        <span className='hint--bottom' data-hint='Transaction fee'>
          {
            transaction.amount < 0 ?
              ticker.currency === 'usd' ?
                btc.satoshisToUsd(transaction.total_fees, currentTicker.price_usd)
                :
                btc.satoshisToBtc(transaction.total_fees)
              :
              null
          }
        </span>
      </section>
    </div>
  </div>
)

Transaction.propTypes = {
  
}

export default Transaction
