import React from 'react'
import PropTypes from 'prop-types'
import Zap from 'components/Icon/Zap'

import { btc } from 'lib/utils'
import { Value } from 'components/UI'

import { FormattedNumber, FormattedTime, injectIntl } from 'react-intl'
import messages from './messages'

import styles from '../Activity.scss'

const Payment = ({
  payment,
  ticker,
  currentTicker,
  showActivityModal,
  nodes,
  currencyName,
  intl
}) => {
  const displayNodeName = pubkey => {
    const node = nodes.find(n => pubkey === n.pub_key)

    if (node && node.alias.length) {
      return node.alias
    }

    return pubkey.substring(0, 10)
  }

  return (
    <div
      className={styles.container}
      onClick={() => showActivityModal('PAYMENT', payment.payment_hash)}
    >
      <div className={styles.activityTypeIcon}>
        <Zap />
      </div>

      <div
        className={`hint--top-right ${styles.data}`}
        data-hint={intl.formatMessage({ ...messages.type })}
      >
        <div className={styles.title}>
          <h3>{displayNodeName(payment.path[payment.path.length - 1])}</h3>
        </div>
        <div className={styles.subtitle}>
          <FormattedTime value={payment.creation_date * 1000} />
        </div>
      </div>
      <div
        className={`hint--top-left ${styles.amount}`}
        data-hint={intl.formatMessage({ ...messages.amount })}
      >
        <span>
          <i className={styles.minus}>-</i>
          <Value
            value={payment.value}
            currency={ticker.currency}
            currentTicker={currentTicker}
            fiatTicker={ticker.fiatTicker}
          />
          <i> {currencyName}</i>
        </span>
        <FormattedNumber
          currency={ticker.fiatTicker}
          style="currency"
          value={btc.convert('sats', 'fiat', payment.value, currentTicker[ticker.fiatTicker])}
        />
      </div>
    </div>
  )
}

Payment.propTypes = {
  currencyName: PropTypes.string.isRequired,
  payment: PropTypes.object.isRequired,
  ticker: PropTypes.object.isRequired,
  currentTicker: PropTypes.object.isRequired,
  nodes: PropTypes.array.isRequired,
  showActivityModal: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired
}

export default injectIntl(Payment)
