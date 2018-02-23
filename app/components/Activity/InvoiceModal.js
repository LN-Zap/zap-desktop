import React from 'react'
import PropTypes from 'prop-types'

import Moment from 'react-moment'
import 'moment-timezone'

import QRCode from 'qrcode.react'
import copy from 'copy-to-clipboard'
import { showNotification } from 'notifications'

import { FaAngleDown } from 'react-icons/lib/fa'

import { btc } from 'utils'
import Value from 'components/Value'

import styles from './InvoiceModal.scss'


const InvoiceModal = ({
  invoice,
  ticker,
  currentTicker,

  toggleCurrencyProps: {
    setActivityModalCurrencyFilters,
    showCurrencyFilters,
    currencyName,
    currentCurrencyFilters,
    setCurrency
  }
}) => {
  const copyPaymentRequest = () => {
    copy(invoice.payment_request)
    showNotification('Noice', 'Successfully copied to clipboard')
  }

  const onCurrencyFilterClick = (currency) => {
    setCurrency(currency)
    setActivityModalCurrencyFilters(false)
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <section className={styles.left}>
          <QRCode
            value={invoice.payment_request}
            renderAs='svg'
            size={150}
            bgColor='transparent'
            fgColor='white'
            level='L'
          />
        </section>
        <section className={styles.right}>
          <div className={styles.details}>
            <section className={styles.amount}>
              <h1>
                <Value value={invoice.value} currency={ticker.currency} currentTicker={currentTicker} />
              </h1>
              <section className={styles.currentCurrency} onClick={() => setActivityModalCurrencyFilters(!showCurrencyFilters)}>
                <span>{currencyName}</span><span><FaAngleDown /></span>
              </section>
              <ul className={showCurrencyFilters && styles.active}>
                {
                  currentCurrencyFilters.map(filter =>
                    <li key={filter.key} onClick={() => onCurrencyFilterClick(filter.key)}>{filter.name}</li>
                  )
                }
              </ul>
            </section>
            <section className={styles.date}>
              <p>
                <Moment format='MM/DD/YYYY'>{invoice.creation_date * 1000}</Moment>
              </p>
              <p className={styles.notPaid}>
                {!invoice.settled && 'Not Paid'}
              </p>
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
        <div>Copy Request</div>
      </div>
    </div>
  )
}

InvoiceModal.propTypes = {
  invoice: PropTypes.object.isRequired
}

export default InvoiceModal
