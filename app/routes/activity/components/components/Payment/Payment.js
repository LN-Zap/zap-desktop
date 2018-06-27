import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'
import { btc } from 'utils'

import Value from 'components/Value'
import styles from '../Activity.scss'

const Payment = ({ payment, ticker, currentTicker, showActivityModal, nodes, currencyName }) => {
  const displayNodeName = pubkey => {
    const node = nodes.find(n => pubkey === n.pub_key)

    if (node && node.alias.length) {
      return node.alias
    }

    return pubkey.substring(0, 10)
  }

  return (
    <div className={styles.container} onClick={() => showActivityModal('PAYMENT', { payment })}>
      <div className={styles.data}>
        <div className={styles.title}>
          <h3>{displayNodeName(payment.path[payment.path.length - 1])}</h3>
        </div>
        <div className={styles.subtitle}>
          <Moment format="h:mm a">{payment.creation_date * 1000}</Moment>
        </div>
      </div>
      <div className={styles.amount}>
        <span className="hint--top" data-hint="Payment amount">
          <i className={styles.minus}>-</i>
          <Value value={payment.value} currency={ticker.currency} currentTicker={currentTicker} />
          <i> {currencyName}</i>
        </span>
        <span className="hint--bottom" data-hint="Payment fee">
          ${btc.convert('sats', 'usd', payment.value, currentTicker.price_usd)}
        </span>
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
  showActivityModal: PropTypes.func.isRequired
}

export default Payment
