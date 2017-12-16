import React from 'react'
import PropTypes from 'prop-types'

import Moment from 'react-moment'
import 'moment-timezone'

import QRCode from 'qrcode.react'

import { FaCircle } from 'react-icons/lib/fa'

import { btc } from 'utils'

import styles from './Invoice.scss'


const Invoice = ({ invoice, ticker, currentTicker }) => (
  <div className={styles.container}>
    <div className={styles.settled}>
      {
        !invoice.settled &&
          <p>
            <FaCircle />
            <span>Not Paid</span>
          </p>
      }
    </div>
    <header>
      <h3>{invoice.memo}</h3>
      <h1>
        <span className={styles.value}>
          {
            ticker.currency === 'usd' ?
              btc.satoshisToUsd(invoice.value, currentTicker.price_usd)
              :
              btc.satoshisToBtc(invoice.value)
          }
        </span>
        <i>BTC</i>
      </h1>
    </header>
    <div className={styles.qrcode}>
      <QRCode value={invoice.payment_request} size={150} />
    </div>
    <div className={styles.input}>
      <input
        readOnly
        className={styles.paymentRequest}
        onClick={event => event.target.select()}
        defaultValue={invoice.payment_request}
      />
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
