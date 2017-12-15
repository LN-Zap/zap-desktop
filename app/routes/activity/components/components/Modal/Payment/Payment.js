import React from 'react'
import PropTypes from 'prop-types'

import Moment from 'react-moment'
import 'moment-timezone'

import { btc } from 'utils'

import styles from './Payment.scss'


const Payment = ({ payment, ticker, currentTicker }) => (
  <div className={styles.container}>
    <header>
      <div className={styles.title}>
        <h2>Sent</h2>
        <h1>
          <span className={styles.value}>
            {
              ticker.currency === 'usd' ?
                btc.satoshisToUsd(payment.value, currentTicker.price_usd)
                :
                btc.satoshisToBtc(payment.value)
            }
          </span>
          <i>
            BTC
          </i>
        </h1>
      </div>
      <h3>{payment.payment_hash}</h3>
    </header>
    <dl>
      <dt>Fee</dt>
      <dd>{payment.fee}</dd>
      <dt>Hops</dt>
      <dd>{payment.path.length}</dd>
      <dt>Date</dt>
      <dd>
        <Moment format='MMM Do'>{payment.creation_date * 1000}</Moment>
      </dd>
    </dl>
  </div>
)

Payment.propTypes = {
  payment: PropTypes.object.isRequired,
  ticker: PropTypes.object.isRequired,
  currentTicker: PropTypes.object.isRequired
}

export default Payment
