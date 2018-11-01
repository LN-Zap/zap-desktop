import React from 'react'
import PropTypes from 'prop-types'
import Dropdown from 'components/UI/Dropdown'
import PaperPlane from 'components/Icon/PaperPlane'
import Zap from 'components/Icon/Zap'
import Value from 'components/Value'
import { FormattedDate, FormattedTime, FormattedMessage } from 'react-intl'
import messages from './messages'
import styles from './PaymentModal.scss'

const PaymentModal = ({
  item: payment,
  ticker,
  currentTicker,

  toggleCurrencyProps: { currencyName, currencyFilters, setCurrency }
}) => (
  <div className={styles.container}>
    <header className={styles.header}>
      <section>
        <PaperPlane />
        <FormattedMessage {...messages.sent} />
      </section>
      <section className={styles.details}>
        <div>
          <Zap />
          <span className={styles.zap}>
            <FormattedMessage {...messages.lightning} />
          </span>
        </div>
        <div>
          <Value
            value={payment.fee}
            currency={ticker.currency}
            currentTicker={currentTicker}
            fiatTicker={ticker.fiatTicker}
          />
          <span>
            {' '}
            {currencyName} <FormattedMessage {...messages.fee} />
          </span>
        </div>
      </section>
    </header>

    <div className={styles.amount}>
      <i className={`${styles.symbol} ${payment.value > 0 ? styles.active : undefined}`}>-</i>
      <Value
        value={payment.value}
        currency={ticker.currency}
        currentTicker={currentTicker}
        fiatTicker={ticker.fiatTicker}
      />
      <Dropdown activeKey={ticker.currency} items={currencyFilters} onChange={setCurrency} ml={2} />
    </div>

    <div className={styles.date}>
      <FormattedDate
        value={new Date(payment.creation_date * 1000)}
        year="numeric"
        month="long"
        day="2-digit"
      />{' '}
      <FormattedTime value={new Date(payment.creation_date * 1000)} />
    </div>

    <footer className={styles.footer}>
      <p>{payment.payment_preimage}</p>
    </footer>
  </div>
)

PaymentModal.propTypes = {
  item: PropTypes.object.isRequired,
  ticker: PropTypes.object.isRequired,
  currentTicker: PropTypes.object.isRequired,

  toggleCurrencyProps: PropTypes.object.isRequired
}

export default PaymentModal
