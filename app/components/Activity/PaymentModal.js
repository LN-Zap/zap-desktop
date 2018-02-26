import React from 'react'
import PropTypes from 'prop-types'

import Moment from 'react-moment'
import 'moment-timezone'

import { FaAngleDown } from 'react-icons/lib/fa'

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
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <section className={styles.left} />
        <section className={styles.right}>
          <div className={styles.details}>
            <section className={styles.amount}>
              <h1>
                <Value value={payment.value} currency={ticker.currency} currentTicker={currentTicker} />
              </h1>
              <section className={styles.currentCurrency} onClick={() => setActivityModalCurrencyFilters(!showCurrencyFilters)}>
                <span>{currencyName}</span><span><FaAngleDown /></span>
              </section>
              <ul className={showCurrencyFilters && styles.active}>
                {
                  currentCurrencyFilters.map(filter =>
                    <li key={filter.key} onClick={() => onCurrencyFilterClick(filter.key)}>{filter.name}</li>)
                }
              </ul>
            </section>
            <section className={styles.date}>
              <p>
                <Moment format='MM/DD/YYYY'>{payment.creation_date * 1000}</Moment>
              </p>
            </section>
          </div>
        </section>
      </div>
    </div>
  )
}

PaymentModal.propTypes = {
  payment: PropTypes.object.isRequired,
  ticker: PropTypes.object.isRequired,
  currentTicker: PropTypes.object.isRequired,

  toggleCurrencyProps: PropTypes.object.isRequired
}

export default PaymentModal
