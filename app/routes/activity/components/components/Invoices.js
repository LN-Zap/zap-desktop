import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'
import 'moment-timezone'
import { FaBitcoin, FaDollar } from 'react-icons/lib/fa'
import { MdCheck } from 'react-icons/lib/md'
import QRCode from 'qrcode.react'
import Modal from './Modal'
import CurrencyIcon from '../../../../components/CurrencyIcon'
import { btc } from '../../../../utils'
import styles from './Invoices.scss'

const Invoices = ({
  invoice,
  invoices,
  ticker,
  setInvoice,
  invoiceModalOpen,
  currentTicker
}) => (
  <div>
    <Modal isOpen={invoiceModalOpen} resetObject={setInvoice}>
      {
        invoice ?
          <div className={styles.invoiceModal}>
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
          :
          null
      }
    </Modal>
    <ul className={styles.invoices}>
      <li className={styles.invoiceTitles}>
        <div className={styles.left}>
          <div>Payment Request</div>
        </div>
        <div className={styles.center}>
          <div>Memo</div>
        </div>
        <div className={styles.right}>
          <div>Amount</div>
        </div>
      </li>
      {
        invoices.map((invoiceItem, index) => (
          <li key={index} className={styles.invoice} onClick={() => setInvoice(invoiceItem)}>
            <div className={styles.left}>
              <div className={styles.path}>{`${invoiceItem.payment_request.substring(0, 75)}...`}</div>
            </div>
            <div className={styles.center}>
              <div>{invoiceItem.memo}</div>
            </div>
            <div className={styles.right}>
              <div className={invoiceItem.settled ? styles.settled : null}>
                {
                  ticker.currency === 'usd' ?
                    btc.satoshisToUsd(invoiceItem.value, currentTicker.price_usd)
                    :
                    btc.satoshisToBtc(invoiceItem.value)
                }
              </div>
            </div>
          </li>
        ))
      }
    </ul>
  </div>
)

Invoices.propTypes = {
  invoice: PropTypes.object,
  invoices: PropTypes.array.isRequired,
  ticker: PropTypes.object.isRequired,
  setInvoice: PropTypes.func.isRequired,
  invoiceModalOpen: PropTypes.bool.isRequired,
  currentTicker: PropTypes.object.isRequired
}

export default Invoices
