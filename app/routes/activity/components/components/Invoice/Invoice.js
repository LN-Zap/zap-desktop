import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'
import 'moment-timezone'
import { FaBolt } from 'react-icons/lib/fa'
import { btc } from '../../../../../utils'
import CurrencyIcon from '../../../../../components/CurrencyIcon'
import styles from '../Activity.scss'

const Invoice = ({ invoice, ticker, currentTicker }) => (
  <div className={styles.container}>
    <div className={styles.label}>
      <i className={`${styles.icon} hint--top`} data-hint='Lightning Network transaction'>
        <FaBolt />
      </i>
      <h3>
        {
          invoice.settled ?
            'Received'
            :
            'Requested'
        }
      </h3>
    </div>
    <div className={styles.data}>
      <div className={styles.title}>
        {invoice.r_hash.toString('hex')}
      </div>
    </div>
    <div className={styles.date}>
      <Moment format='MMM Do'>
        {invoice.creation_date * 1000}
      </Moment>
    </div>
    <div className={`${styles.amount} ${invoice.settled ? styles.positive : styles.negative}`}>
      <section>
        <CurrencyIcon
          currency={ticker.currency}
          crypto={ticker.crypto}
          styles={{ verticalAlign: 'top', width: '24px' }}
        />
      </section>
      <section>
        <span className='hint--top' data-hint='Invoice amount'>
          {
            ticker.currency === 'usd' ?
              btc.satoshisToUsd(invoice.value, currentTicker.price_usd)
              :
              btc.satoshisToBtc(invoice.value)
          }
        </span>
        <span className='hint--bottom' data-hint='Invoice fee'>
          {
            ticker.currency === 'usd' ?
              btc.satoshisToUsd(invoice.fee, currentTicker.price_usd)
              :
              btc.satoshisToBtc(invoice.fee)
          }
        </span>
      </section>
    </div>
  </div>
)

Invoice.propTypes = {
  
}

export default Invoice
