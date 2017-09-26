import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'
import 'moment-timezone'
import { FaBolt, FaClockO } from 'react-icons/lib/fa'
import { btc } from 'utils'
import styles from '../Activity.scss'

const Invoice = ({ invoice, ticker, currentTicker, showActivityModal }) => (
  <div className={styles.container} onClick={() => showActivityModal('INVOICE', { invoice })}>
    {
      !invoice.settled ?
        <div className={styles.clock}>
          <i className='hint--top' data-hint='Request has not been paid'>
            <FaClockO />
          </i>
        </div>
        :
        null
    }
    <div className={styles.date}>
      <Moment format='D'>
        {invoice.creation_date * 1000}
      </Moment>
      <Moment format='MMMM'>
        {invoice.creation_date * 1000}
      </Moment>
    </div>
    <div className={styles.data}>
      <div className={styles.title}>
        <i className={`${styles.icon} hint--top`} data-hint='Lightning Network request'>
          <FaBolt />
        </i>
        <h3>
          { invoice.settled ? 'Received' : 'Requested' }
        </h3>
        <span>
          {ticker.currency}
        </span>
      </div>
      <div className={styles.subtitle}>
        {invoice.r_hash.toString('hex')}
      </div>
    </div>
    <div className={`${styles.amount} ${invoice.settled ? styles.positive : styles.negative}`}>
      <span className='hint--top' data-hint='Invoice amount'>
        +
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
    </div>
  </div>
)

Invoice.propTypes = {
  invoice: PropTypes.object.isRequired,
  ticker: PropTypes.object.isRequired,
  currentTicker: PropTypes.object.isRequired,
  showActivityModal: PropTypes.func.isRequired
}

export default Invoice
