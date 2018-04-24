import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'
import 'moment-timezone'
import { btc } from 'utils'

import Isvg from 'react-inlinesvg'
import Value from 'components/Value'
import checkmarkIcon from 'icons/check_circle.svg'
import styles from '../Activity.scss'

const Invoice = ({
  invoice, ticker, currentTicker, showActivityModal
}) => (
  <div className={`${styles.container} ${!invoice.settled && styles.unpaid}`} onClick={() => showActivityModal('INVOICE', { invoice })}>
    {
      !invoice.settled && (
        <div className={styles.pendingIcon}>
          <Isvg src={checkmarkIcon} />
        </div>
      )
    }

    <div className={styles.data}>
      <div className={styles.title}>
        <h3>
          { invoice.settled ? 'Received payment' : 'Requested payment' }
        </h3>
      </div>
      <div className={styles.subtitle}>
        <Moment format='h:mm a'>{invoice.settled ? invoice.settled_date * 1000 : invoice.creation_date * 1000}</Moment>
      </div>
    </div>
    <div className={`${styles.amount} ${invoice.settled ? styles.positive : styles.negative}`}>
      <span className='hint--top' data-hint='Invoice amount'>
        <i className={styles.plus}>+</i>
        <Value
          value={invoice.value}
          currency={ticker.currency}
          currentTicker={currentTicker}
        />
      </span>
      <span>
        <span>
          ${btc.convert('sats', 'usd', invoice.value, currentTicker.price_usd)}
        </span>
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
