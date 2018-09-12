import React from 'react'
import PropTypes from 'prop-types'

import Moment from 'react-moment'

import FaAngleDown from 'react-icons/lib/fa/angle-down'

import Isvg from 'react-inlinesvg'
import paperPlane from 'icons/paper_plane.svg'
import hand from 'icons/hand.svg'
import link from 'icons/link.svg'
import { blockExplorer } from 'lib/utils'

import Value from 'components/Value'

import styles from './TransactionModal.scss'

const TransactionModal = ({
  item: transaction,
  ticker,
  currentTicker,
  network,

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
      {transaction.received ? (
        <section>
          <Isvg src={hand} />
          <span>Received</span>
        </section>
      ) : (
        <section>
          <Isvg src={paperPlane} />
          <span>Sent</span>
        </section>
      )}
      <section className={styles.details}>
        <div>
          <Isvg src={link} />
          <span
            className={styles.link}
            onClick={() => blockExplorer.showTransaction(network, transaction.tx_hash)}
          >
            On-Chain
          </span>
        </div>
        <div>
          <Value
            value={transaction.total_fees}
            currency={ticker.currency}
            currentTicker={currentTicker}
            fiatTicker={ticker.fiatTicker}
          />
          <span> {currencyName} fee</span>
        </div>
      </section>
    </header>

    <div className={styles.amount}>
      <h1>
        <i className={`${styles.symbol} ${transaction.received ? styles.active : undefined}`}>
          {transaction.received ? '+' : '-'}
        </i>
        <Value
          value={transaction.amount}
          currency={ticker.currency}
          currentTicker={currentTicker}
          fiatTicker={ticker.fiatTicker}
        />
      </h1>
      <section
        className={styles.currentCurrency}
        onClick={() => setActivityModalCurrencyFilters(!showCurrencyFilters)}
      >
        <span>{currencyName}</span>
        <span>
          <FaAngleDown />
        </span>
        <ul className={showCurrencyFilters ? styles.active : undefined}>
          {currentCurrencyFilters.map(filter => (
            <li key={filter.key} onClick={() => onCurrencyFilterClick(filter.key)}>
              {filter.name}
            </li>
          ))}
        </ul>
      </section>
    </div>

    <div className={styles.date}>
      <Moment format="LLL">{transaction.time_stamp * 1000}</Moment>
    </div>

    <footer className={styles.footer}>
      <p onClick={() => blockExplorer.showTransaction(network, transaction.tx_hash)}>
        {transaction.tx_hash}
      </p>
    </footer>
  </div>
)

TransactionModal.propTypes = {
  item: PropTypes.object.isRequired,
  ticker: PropTypes.object.isRequired,
  currentTicker: PropTypes.object.isRequired,

  toggleCurrencyProps: PropTypes.object.isRequired,

  network: PropTypes.object.isRequired
}

export default TransactionModal
