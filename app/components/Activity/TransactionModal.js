import React from 'react'
import PropTypes from 'prop-types'

import Moment from 'react-moment'
import 'moment-timezone'

import { FaAngleDown } from 'react-icons/lib/fa'

import { showTransaction, showBlock } from 'utils/blockExplorer'

import Value from 'components/Value'

import styles from './TransactionModal.scss'

const TransactionModal = ({
  transaction,
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
        <section className={styles.top}>
          <div className={styles.details}>
            <section className={styles.amount}>
              <h1>
                <i className={`${styles.symbol} ${transaction.amount > 0 && styles.active}`}>
                  {
                    transaction.amount > 0 ?
                      '+'
                      :
                      '-'
                  }
                </i>
                <Value value={transaction.amount} currency={ticker.currency} currentTicker={currentTicker} />
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
              <p>{transaction.num_confirmations} {transaction.num_confirmations > 1 ? 'confirmations' : 'confirmation'}</p>
              <p>
                <Value value={transaction.total_fees} currency={ticker.currency} currentTicker={currentTicker} />
                <span> {currencyName} fee</span>
              </p>
            </section>
          </div>
        </section>
        <section className={styles.bottom}>
          <div className={styles.txHash}>
            <h4>Transaction</h4>
            <p onClick={() => showTransaction(transaction.tx_hash)}>{transaction.tx_hash}</p>
          </div>

          <div className={styles.blockHash}>
            <h4>Block</h4>
            <p onClick={() => showBlock(transaction.block_hash)}>{transaction.block_hash}</p>
          </div>
        </section>
      </div>
    </div>
  )
}

TransactionModal.propTypes = {
  transaction: PropTypes.object.isRequired,
  ticker: PropTypes.object.isRequired,
  currentTicker: PropTypes.object.isRequired,

  toggleCurrencyProps: PropTypes.object.isRequired
}

export default TransactionModal
