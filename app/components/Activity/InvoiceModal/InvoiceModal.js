import React from 'react'
import PropTypes from 'prop-types'

import Moment from 'react-moment'

import QRCode from 'qrcode.react'
import copy from 'copy-to-clipboard'
import { showNotification } from 'lib/utils/notifications'

import FaAngleDown from 'react-icons/lib/fa/angle-down'

import Value from 'components/Value'
import Countdown from '../Countdown'

import styles from './InvoiceModal.scss'

const InvoiceModal = ({
  item: invoice,
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
  const copyPaymentRequest = () => {
    copy(invoice.payment_request)
    showNotification('Noice', 'Successfully copied to clipboard')
  }

  const countDownDate = parseInt(invoice.creation_date, 10) + parseInt(invoice.expiry, 10)

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <section className={styles.left}>
          <h2>Payment Request</h2>
          <QRCode
            value={invoice.payment_request}
            renderAs="svg"
            size={150}
            bgColor="white"
            fgColor="#252832"
            level="L"
            className={styles.qrcode}
          />
          <Countdown countDownDate={countDownDate} />
        </section>
        <section className={styles.right}>
          <div className={styles.details}>
            <section className={styles.amount}>
              <h1>
                <Value
                  value={invoice.finalAmount}
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
              </section>
              <ul className={showCurrencyFilters ? styles.active : undefined}>
                {currentCurrencyFilters.map(filter => (
                  <li key={filter.key} onClick={() => onCurrencyFilterClick(filter.key)}>
                    {filter.name}
                  </li>
                ))}
              </ul>
            </section>
            <section className={styles.date}>
              <p>
                <Moment format="MM/DD/YYYY">{invoice.creation_date * 1000}</Moment>
              </p>
              {!invoice.settled && <p className={styles.notPaid}>Not Paid</p>}
              {invoice.settled && <p className={styles.paid}>Paid</p>}
            </section>
          </div>

          <div className={styles.memo}>
            <h4>Memo</h4>
            <p>{invoice.memo}</p>
          </div>

          <div className={styles.request}>
            <h4>Request</h4>
            <p>{invoice.payment_request}</p>
          </div>
        </section>
      </div>

      <div className={styles.actions}>
        <div>Save as image</div>
        <div onClick={copyPaymentRequest}>Copy Request</div>
      </div>
    </div>
  )
}

InvoiceModal.propTypes = {
  item: PropTypes.object.isRequired,
  ticker: PropTypes.object.isRequired,
  currentTicker: PropTypes.object.isRequired,
  toggleCurrencyProps: PropTypes.object.isRequired
}

export default InvoiceModal
