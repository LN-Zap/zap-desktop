import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'
import 'moment-timezone'
import Isvg from 'react-inlinesvg'
import { FaChain } from 'react-icons/lib/fa'
import { btc } from 'utils'
import Value from 'components/Value'
import checkmarkIcon from 'icons/check_circle.svg'
import styles from '../Activity.scss'

const Transaction = ({
  transaction, ticker, currentTicker, showActivityModal
}) => (
  <div className={styles.container} onClick={() => showActivityModal('TRANSACTION', { transaction })}>
    <div className={styles.date}>
      <section>
        <Isvg src={checkmarkIcon} />
      </section>
      <section>
        <Moment format='MMM'>{transaction.time_stamp * 1000}</Moment> <Moment format='D'>{transaction.time_stamp * 1000}</Moment>
      </section>
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
        <i className={transaction.amount > 0 ? styles.plus : styles.minus}>{ transaction.amount > 0 ? '+' : '-' }</i>
        <Value
          value={transaction.amount}
          currency={ticker.currency}
          currentTicker={currentTicker}
        />
      </span>
      <span className='hint--bottom' data-hint='Transaction fee'>
        <Value
          value={transaction.total_fees}
          currency={ticker.currency}
          currentTicker={currentTicker}
        />
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
