import React from 'react'
import PropTypes from 'prop-types'

import Moment from 'react-moment'
import 'moment-timezone'

import CurrencyIcon from 'components/CurrencyIcon'
import { btc } from 'utils'

import styles from './Payment.scss'


const Payment = ({ payment, ticker, currentTicker }) => (
  <div className={styles.container}>
    <h3>{payment.payment_hash}</h3>
    <h1>
      <CurrencyIcon currency={ticker.currency} crypto={ticker.crypto} styles={{ verticalAlign: 'top' }} />
      <span className={styles.value}>
        {
          ticker.currency === 'usd' ?
            btc.satoshisToUsd(payment.value, currentTicker.price_usd)
            :
            btc.satoshisToBtc(payment.value)
        }
      </span>
    </h1>
    <dl>
      <dt>Fee</dt>
      <dd>{payment.fee}</dd>
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
