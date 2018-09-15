import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'
import Isvg from 'react-inlinesvg'
import link from 'icons/link.svg'

import { btc } from 'lib/utils'
import Value from 'components/Value'

import { FormattedMessage, injectIntl } from 'react-intl'
import messages from './messages'

import styles from '../Activity.scss'

const Transaction = ({
  transaction,
  ticker,
  currentTicker,
  showActivityModal,
  currencyName,
  intl
}) => (
  <div
    className={styles.container}
    onClick={() => showActivityModal('TRANSACTION', transaction.tx_hash)}
  >
    <div className={styles.activityTypeIcon}>
      <section className="hint--bottom" data-hint={intl.formatMessage({ ...messages.type })}>
        <Isvg src={link} />
      </section>
    </div>

    <div className={styles.data}>
      <div className={styles.title}>
        <h3>
          {transaction.received ? (
            <FormattedMessage {...messages.received} />
          ) : (
            <FormattedMessage {...messages.sent} />
          )}
        </h3>
      </div>
      <div className={styles.subtitle}>
        <Moment format="h:mm a">{transaction.time_stamp * 1000}</Moment>
      </div>
    </div>
    <div
      className={`hint--top-left ${styles.amount} ${
        transaction.received ? styles.positive : styles.negative
      }`}
      data-hint={intl.formatMessage({ ...messages.amount })}
    >
      <span>
        <i className={transaction.received ? styles.plus : styles.minus}>
          {transaction.received ? '+' : '-'}
        </i>
        <Value
          value={transaction.amount}
          currency={ticker.currency}
          currentTicker={currentTicker}
          fiatTicker={ticker.fiatTicker}
        />
        <i> {currencyName}</i>
      </span>
      <span className="hint--bottom" data-hint={intl.formatMessage({ ...messages.fee })}>
        {currentTicker[ticker.fiatTicker].symbol}
        {btc.convert('sats', 'fiat', transaction.amount, currentTicker[ticker.fiatTicker].last)}
      </span>
    </div>
  </div>
)

Transaction.propTypes = {
  transaction: PropTypes.object.isRequired,
  ticker: PropTypes.object.isRequired,
  currentTicker: PropTypes.object.isRequired,
  showActivityModal: PropTypes.func.isRequired,
  currencyName: PropTypes.string.isRequired
}

export default injectIntl(Transaction)
