import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'
import 'moment-timezone'
import Isvg from 'react-inlinesvg'
import { FaBolt } from 'react-icons/lib/fa'
import Value from 'components/Value'
import checkmarkIcon from 'icons/check_circle.svg'
import styles from '../Activity.scss'

const Payment = ({
  payment, ticker, currentTicker, showActivityModal
}) => (
  <div className={styles.container} onClick={() => showActivityModal('PAYMENT', { payment })}>
    <div className={styles.date}>
      <section>
        <Isvg src={checkmarkIcon} />
      </section>
      <section>
        <Moment format='MMM'>{payment.creation_date * 1000}</Moment> <Moment format='D'>{payment.creation_date * 1000}</Moment>
      </section>
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
        <i className={styles.minus}>-</i>
        <Value
          value={payment.value}
          currency={ticker.currency}
          currentTicker={currentTicker}
        />
      </span>
      <span className='hint--bottom' data-hint='Payment fee'>
        <Value
          value={payment.fee}
          currency={ticker.currency}
          currentTicker={currentTicker}
        />
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
