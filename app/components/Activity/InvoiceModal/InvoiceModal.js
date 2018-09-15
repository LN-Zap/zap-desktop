import React from 'react'
import PropTypes from 'prop-types'

import QRCode from 'qrcode.react'
import copy from 'copy-to-clipboard'
import { showNotification } from 'lib/utils/notifications'

import { MdKeyboardArrowDown } from 'react-icons/md'

import Value from 'components/Value'
import { FormattedDate, FormattedTime, FormattedMessage } from 'react-intl'
import Countdown from '../Countdown'

import messages from './messages'

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
    showNotification('Noice', <FormattedMessage {...messages.copied} />)
  }

  const countDownDate = parseInt(invoice.creation_date, 10) + parseInt(invoice.expiry, 10)

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <section className={styles.left}>
          <h2>
            <FormattedMessage {...messages.pay_req} />
          </h2>
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
                  <MdKeyboardArrowDown />
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
                <FormattedDate
                  value={invoice.creation_date * 1000}
                  year="numeric"
                  month="long"
                  day="2-digit"
                />{' '}
                <FormattedTime value={new Date(invoice.creation_date * 1000)} />
              </p>
              {!invoice.settled && (
                <p className={styles.notPaid}>
                  <FormattedMessage {...messages.not_paid} />
                </p>
              )}
              {invoice.settled && (
                <p className={styles.paid}>
                  <FormattedMessage {...messages.paid} />
                </p>
              )}
            </section>
          </div>

          <div className={styles.memo}>
            <h4>
              <FormattedMessage {...messages.memo} />
            </h4>
            <p>{invoice.memo}</p>
          </div>

          <div className={styles.request}>
            <h4>
              <FormattedMessage {...messages.request} />
            </h4>
            <p>{invoice.payment_request}</p>
          </div>
        </section>
      </div>

      <div className={styles.actions}>
        <div>
          <FormattedMessage {...messages.save} />
        </div>
        <div onClick={copyPaymentRequest}>
          <FormattedMessage {...messages.copy} />
        </div>
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
