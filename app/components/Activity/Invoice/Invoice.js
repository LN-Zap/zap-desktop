import React from 'react'
import PropTypes from 'prop-types'
import { btc } from 'lib/utils'
import { Value } from 'components/UI'
import CheckCircle from 'components/Icon/CheckCircle'

import { FormattedNumber, FormattedTime, FormattedMessage, injectIntl } from 'react-intl'
import messages from './messages'

import styles from '../Activity.scss'

const Invoice = ({ invoice, ticker, currentTicker, showActivityModal, currencyName, intl }) => (
  <div
    className={`${styles.container} ${!invoice.settled ? styles.unpaid : undefined}`}
    onClick={() => showActivityModal('INVOICE', invoice.payment_request)}
  >
    <div className={styles.activityTypeIcon}>
      <CheckCircle />
    </div>

    <div
      className={`hint--top-right ${styles.data}`}
      data-hint={
        invoice.settled
          ? intl.formatMessage({ ...messages.type_paid })
          : intl.formatMessage({ ...messages.type_unpaid })
      }
    >
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
        <FormattedTime
          value={invoice.settled ? invoice.settle_date * 1000 : invoice.creation_date * 1000}
        />
      </div>
    </div>
    <div
      className={`hint--top-left ${styles.amount}`}
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
      <FormattedNumber
        currency={ticker.fiatTicker}
        style="currency"
        value={btc.convert('sats', 'fiat', invoice.value, currentTicker[ticker.fiatTicker])}
      />
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
