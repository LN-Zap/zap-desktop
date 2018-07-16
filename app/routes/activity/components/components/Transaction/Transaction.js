import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'
import { btc } from 'utils'

import Value from 'components/Value'
import styles from '../Activity.scss'

const Transaction = ({ transaction, ticker, currentTicker, showActivityModal, currencyName }) => (
  <div
    className={styles.container}
    onClick={() => showActivityModal('TRANSACTION', { transaction })}
  >
    <div className={styles.data}>
      <div className={styles.title}>
        <h3>{transaction.received ? 'Received' : 'Sent'}</h3>
      </div>
      <div className={styles.subtitle}>
        <Moment format="h:mm a">{transaction.time_stamp * 1000}</Moment>
      </div>
    </div>
    <div className={`${styles.amount} ${transaction.received ? styles.positive : styles.negative}`}>
      <span className="hint--top" data-hint="Transaction amount">
        <i className={transaction.received ? styles.plus : styles.minus}>
          {transaction.received ? '+' : '-'}
        </i>
        <Value
          value={transaction.amount}
          currency={ticker.currency}
          currentTicker={currentTicker}
        />
        <i> {currencyName}</i>
      </span>
      <span className="hint--bottom" data-hint="Transaction fee">
        ${btc.convert('sats', 'usd', transaction.amount, currentTicker.price_usd)}
      </span>
    </div>
  </div>
)

Transaction.propTypes = {
  transaction: PropTypes.object.isRequired,
  ticker: PropTypes.object.isRequired,
  currentTicker: PropTypes.object.isRequired,
  showActivityModal: PropTypes.func.isRequired,
  currencyName: PropTypes.string.isRequired
}

export default Transaction
