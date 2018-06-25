import React from 'react'
import PropTypes from 'prop-types'

import Moment from 'react-moment'

import FaAngleDown from 'react-icons/lib/fa/angle-down'

import Isvg from 'react-inlinesvg'
import paperPlane from 'icons/paper_plane.svg'
import zap from 'icons/zap.svg'

import Value from 'components/Value'

import styles from './PaymentModal.scss'

const PaymentModal = ({
  payment,
  ticker,
  currentTicker,

  toggleCurrencyProps: {
    setActivityModalCurrencyFilters,
    showCurrencyFilters,
    currencyName,
    currentCurrencyFilters,
    onCurrencyFilterClick
  }
}) => (
  <div className={styles.container}>
    <header className={styles.header}>
      <section>
        <Isvg src={paperPlane} />
        <span>Sent</span>
      </section>
      <section className={styles.details}>
        <div>
          <Isvg src={zap} />
          <span className={styles.zap}>Lightning Network</span>
        </div>
        <div>
          <Value value={payment.fee} currency={ticker.currency} currentTicker={currentTicker} />
          <span> {currencyName} fee</span>
        </div>
      </section>
    </header>

    <div className={styles.amount}>
      <h1>
        <i className={`${styles.symbol} ${payment.value > 0 && styles.active}`}>-</i>
        <Value value={payment.value} currency={ticker.currency} currentTicker={currentTicker} />
      </h1>
      <section
        className={styles.currentCurrency}
        onClick={() => setActivityModalCurrencyFilters(!showCurrencyFilters)}
      >
        <span>{currencyName}</span>
        <span>
          <FaAngleDown />
        </span>
        <ul className={showCurrencyFilters && styles.active}>
          {currentCurrencyFilters.map(filter => (
            <li key={filter.key} onClick={() => onCurrencyFilterClick(filter.key)}>
              {filter.name}
            </li>
          ))}
        </ul>
      </section>
    </div>

    <div className={styles.date}>
      <Moment format="LLL">{payment.creation_date * 1000}</Moment>
    </div>

    <footer className={styles.footer}>
      <p>{payment.payment_preimage}</p>
    </footer>
  </div>
)

PaymentModal.propTypes = {
  payment: PropTypes.object.isRequired,
  ticker: PropTypes.object.isRequired,
  currentTicker: PropTypes.object.isRequired,

  toggleCurrencyProps: PropTypes.object.isRequired
}

export default PaymentModal
