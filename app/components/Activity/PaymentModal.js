import React from 'react'
import PropTypes from 'prop-types'

import Moment from 'react-moment'
import 'moment-timezone'

import { FaAngleDown } from 'react-icons/lib/fa'

import { showTransaction, showBlock } from 'utils/blockExplorer'

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
  console.log('payment: ', payment)
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <section className={styles.top}>
          <div className={styles.details}>
            <section className={styles.amount}>
              <h1>
                <i className={styles.symbol}>-</i>
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
            <section className={styles.fee}>
              <p>Sent</p>
              <p>
                <Value value={payment.fee} currency={ticker.currency} currentTicker={currentTicker} />
                <span> {currencyName} fee</span>
              </p>
            </section>
          </div>
        </section>
        <section className={styles.bottom}>
          <div className={styles.txHash}>
            <h4>Memo</h4>
            <p>{payment.memo}</p>
          </div>

          <div className={styles.blockHash}>
            <h4>Proof</h4>
            <p>{payment.payment_preimage}</p>
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
