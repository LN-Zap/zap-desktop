import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'
import { btc } from 'lib/utils'

import Isvg from 'react-inlinesvg'
import Value from 'components/Value'
import checkmarkIcon from 'icons/check_circle.svg'

import { FormattedMessage, injectIntl } from 'react-intl'
import messages from './messages'

import styles from '../Activity.scss'

const Invoice = ({ invoice, ticker, currentTicker, showActivityModal, currencyName, intl }) => (
  <div
    className={`${styles.container} ${!invoice.settled ? styles.unpaid : undefined}`}
    onClick={() => showActivityModal('INVOICE', invoice.payment_request)}
  >
    <div className={styles.activityTypeIcon}>
      <section
        className="hint--bottom"
        data-hint={
          invoice.settled
            ? intl.formatMessage({ ...messages.type_paid })
            : intl.formatMessage({ ...messages.type_unpaid })
        }
      >
        <Isvg src={checkmarkIcon} />
      </section>
    </div>

    <div className={styles.data}>
      <div className={styles.title}>
        <h3>
          {invoice.settled ? (
            <FormattedMessage {...messages.received} />
          ) : (
            <FormattedMessage {...messages.requested} />
          )}
        </h3>
      </div>
      <div className={styles.subtitle}>
        <Moment format="h:mm a">
          {invoice.settled ? invoice.settle_date * 1000 : invoice.creation_date * 1000}
        </Moment>
      </div>
    </div>
    <div
      className={`hint--top-left ${styles.amount} ${
        invoice.settled ? styles.positive : styles.negative
      }`}
      data-hint={intl.formatMessage({ ...messages.amount })}
    >
      <span>
        <i className={styles.plus}>+</i>
        <Value
          value={invoice.value}
          currency={ticker.currency}
          currentTicker={currentTicker}
          fiatTicker={ticker.fiatTicker}
        />
        <i> {currencyName}</i>
      </span>
      <span>
        <span>
          {currentTicker[ticker.fiatTicker].symbol}
          {btc.convert('sats', 'fiat', invoice.value, currentTicker[ticker.fiatTicker].last)}
        </span>
      </span>
    </div>
  </div>
)

Invoice.propTypes = {
  invoice: PropTypes.object.isRequired,
  ticker: PropTypes.object.isRequired,
  currentTicker: PropTypes.object.isRequired,
  showActivityModal: PropTypes.func.isRequired,
  currencyName: PropTypes.string.isRequired
}

export default injectIntl(Invoice)
