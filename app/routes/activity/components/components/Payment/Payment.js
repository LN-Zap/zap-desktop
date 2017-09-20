import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'
import 'moment-timezone'
import { FaBolt } from 'react-icons/lib/fa'
import { btc } from '../../../../../utils'
import CurrencyIcon from '../../../../../components/CurrencyIcon'
import styles from '../Activity.scss'

const Payment = ({ payment, ticker, currentTicker }) => (
  <div className={styles.container}>
    <div className={styles.label}>
      <i className={`${styles.icon} hint--top`} data-hint='Lightning Network transaction'>
        <FaBolt />
      </i>
      <h3>
        Sent
      </h3>
    </div>
    <div className={styles.data}>
      <div className={styles.title}>
        {payment.payment_hash}
      </div>
    </div>
    <div className={styles.date}>
      <Moment format='MMM Do'>{payment.creation_date * 1000}</Moment>
    </div>
    <div className={styles.amount}>
      <section>
        <CurrencyIcon
          currency={ticker.currency}
          crypto={ticker.crypto}
          styles={{ verticalAlign: 'top', width: '24px' }}
        />
      </section>
      <section>
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
      </section>
    </div>
  </div>
)

Payment.propTypes = {
  
}

export default Payment
