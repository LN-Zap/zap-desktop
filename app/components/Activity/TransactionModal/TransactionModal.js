import React from 'react'
import PropTypes from 'prop-types'
import Dropdown from 'components/UI/Dropdown'
import PaperPlane from 'components/Icon/PaperPlane'
import Hand from 'components/Icon/Hand'
import ChainLink from 'components/Icon/ChainLink'
import { blockExplorer } from 'lib/utils'

import Value from 'components/Value'

import { FormattedDate, FormattedTime, FormattedMessage } from 'react-intl'
import messages from './messages'

import styles from './TransactionModal.scss'

const TransactionModal = ({
  item: transaction,
  ticker,
  currentTicker,
  network,

  toggleCurrencyProps: { currencyName, currencyFilters, setCurrency }
}) => (
  <div className={styles.container}>
    <header className={styles.header}>
      {transaction.received ? (
        <section>
          <Hand />
          <span>
            <FormattedMessage {...messages.received} />
          </span>
        </section>
      ) : (
        <section>
          <PaperPlane />
          <span>
            <FormattedMessage {...messages.sent} />
          </span>
        </section>
      )}
      <section className={styles.details}>
        <div>
          <ChainLink />
          <span
            className={styles.link}
            onClick={() => blockExplorer.showTransaction(network, transaction.tx_hash)}
          >
            <FormattedMessage {...messages.on_chain} />
          </span>
        </div>
        {!transaction.received && (
          <div>
            <Value
              value={transaction.total_fees}
              currency={ticker.currency}
              currentTicker={currentTicker}
              fiatTicker={ticker.fiatTicker}
            />
            <span>
              {' '}
              {currencyName} <FormattedMessage {...messages.fee} />
            </span>
          </div>
        )}
      </section>
    </header>

    <div className={styles.amount}>
      <i className={`${styles.symbol} ${transaction.received ? styles.active : undefined}`}>
        {transaction.received ? '+' : '-'}
      </i>
      <Value
        value={transaction.amount}
        currency={ticker.currency}
        currentTicker={currentTicker}
        fiatTicker={ticker.fiatTicker}
      />
      <Dropdown activeKey={ticker.currency} items={currencyFilters} onChange={setCurrency} ml={2} />
    </div>

    <div className={styles.date}>
      <FormattedDate
        value={new Date(transaction.time_stamp * 1000)}
        year="numeric"
        month="long"
        day="2-digit"
      />{' '}
      <FormattedTime value={new Date(transaction.time_stamp * 1000)} />
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
