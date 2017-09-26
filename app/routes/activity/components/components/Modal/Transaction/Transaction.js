import React from 'react'
import PropTypes from 'prop-types'

import Moment from 'react-moment'
import 'moment-timezone'

import CurrencyIcon from 'components/CurrencyIcon'
import { btc } from 'utils'

import styles from './Transaction.scss'


const Transaction = ({ transaction, ticker, currentTicker }) => (
  <div className={styles.container}>
    <h2>
      {
        transaction.amount < 0 ?
          'Sent'
          :
          'Received'
      }
    </h2>
    <h3>{transaction.tx_hash}</h3>
    <h1>
      <CurrencyIcon currency={ticker.currency} crypto={ticker.crypto} styles={{ verticalAlign: 'top' }} />
      <span className={styles.value}>
        {
          ticker.currency === 'usd' ?
            btc.satoshisToUsd(transaction.amount, currentTicker.price_usd)
            :
            btc.satoshisToBtc(transaction.amount)
        }
      </span>
    </h1>
    <dl>
      <dt>Confirmations</dt>
      <dd>{transaction.num_confirmations}</dd>
      <dt>Fee</dt>
      <dd>{transaction.total_fees}</dd>
      <dt>Date</dt>
      <dd>
        <Moment format='MMM Do'>{transaction.time_stamp * 1000}</Moment>
      </dd>
    </dl>
  </div>
)

Transaction.propTypes = {
  transaction: PropTypes.object.isRequired,
  ticker: PropTypes.object.isRequired,
  currentTicker: PropTypes.object.isRequired
}

export default Transaction
