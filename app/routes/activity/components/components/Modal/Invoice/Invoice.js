import React from 'react'
import PropTypes from 'prop-types'

import Moment from 'react-moment'
import 'moment-timezone'

import QRCode from 'qrcode.react'

import { MdCheck } from 'react-icons/lib/md'

import CurrencyIcon from 'components/CurrencyIcon'
import { btc } from 'utils'

import styles from './Invoice.scss'


const Invoice = ({ invoice, ticker, currentTicker }) => (
  <div className={styles.container}>
    <h3>{invoice.memo}</h3>
    <h1>
      <CurrencyIcon currency={ticker.currency} crypto={ticker.crypto} styles={{ verticalAlign: 'top' }} />
      <span className={styles.value}>
        {
          ticker.currency === 'usd' ?
            btc.satoshisToUsd(invoice.value, currentTicker.price_usd)
            :
            btc.satoshisToBtc(invoice.value)
        }
      </span>
    </h1>
    <div className={styles.qrcode}>
      <QRCode value={invoice.payment_request} size={200} />
      <input
        readOnly
        className={styles.paymentRequest}
        onClick={event => event.target.select()}
        defaultValue={invoice.payment_request}
      />
    </div>
    <div className={styles.settled}>
      {
        invoice.settled ?
          <p><MdCheck style={{ verticalAlign: 'top' }} /> Paid</p>
          :
          <p>Not Paid</p>
      }
    </div>
    <p className={styles.date}>
      Created on
      <Moment format='MMM Do'>{invoice.creation_date * 1000}</Moment>
    </p>
  </div>
)

Invoice.propTypes = {
  invoice: PropTypes.object.isRequired,
  ticker: PropTypes.object.isRequired,
  currentTicker: PropTypes.object.isRequired
}

export default Invoice
