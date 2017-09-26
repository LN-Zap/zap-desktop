import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'
import 'moment-timezone'
import { FaBolt } from 'react-icons/lib/fa'
import { btc } from 'utils'
import styles from '../Activity.scss'

const Payment = ({ payment, ticker, currentTicker, showActivityModal }) => (
  <div className={styles.container} onClick={() => showActivityModal('PAYMENT', { payment })}>
    <div className={styles.date}>
      <Moment format='D'>
        {payment.creation_date * 1000}
      </Moment>
      <Moment format='MMMM'>
        {payment.creation_date * 1000}
      </Moment>
    </div>
    <div className={styles.data}>
      <div className={styles.title}>
        <i className={`${styles.icon} hint--top`} data-hint='Lightning Network payment'>
          <FaBolt />
        </i>
        <h3>
          Sent
        </h3>
        <span>
          {ticker.currency}
        </span>
      </div>
      <div className={styles.subtitle}>
        {payment.payment_hash.toString('hex')}
      </div>
    </div>
    <div className={styles.amount}>
      <span className='hint--top' data-hint='Payment amount'>
        -
        {
          ticker.currency === 'usd' ?
            btc.satoshisToUsd(payment.value, currentTicker.price_usd)
            :
            btc.satoshisToBtc(payment.value)
        }
      </span>
      <span className='hint--bottom' data-hint='Payment fee'>
        {
          ticker.currency === 'usd' ?
            btc.satoshisToUsd(payment.fee, currentTicker.price_usd)
            :
            btc.satoshisToBtc(payment.fee)
        }
      </span>
    </div>
  </div>
)

Payment.propTypes = {
  payment: PropTypes.object.isRequired,
  ticker: PropTypes.object.isRequired,
  currentTicker: PropTypes.object.isRequired,
  showActivityModal: PropTypes.func.isRequired
}

export default Payment
