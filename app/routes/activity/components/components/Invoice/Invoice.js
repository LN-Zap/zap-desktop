import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'
import 'moment-timezone'
import Isvg from 'react-inlinesvg'
import { FaBolt } from 'react-icons/lib/fa'
import { btc } from 'utils'
import checkmarkIcon from 'icons/check_circle.svg'
import clockIcon from 'icons/clock.svg'
import styles from '../Activity.scss'

const Invoice = ({
  invoice, ticker, currentTicker, showActivityModal
}) => (
  <div className={`${styles.container} ${!invoice.settled && styles.unpaid}`} onClick={() => showActivityModal('INVOICE', { invoice })}>
    <div className={styles.date}>
      <section>
        {
          invoice.settled ?
            <Isvg src={checkmarkIcon} />
            :
            <i className='hint--top' data-hint='Request has not been paid'>
              <Isvg src={clockIcon} />
            </i>
        }
      </section>
      <section>
        <Moment format='MMM'>{invoice.creation_date * 1000}</Moment> <Moment format='D'>{invoice.creation_date * 1000}</Moment>
      </section>
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
        <i className={styles.plus}>+</i>
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
