// @flow
import React, { Component } from 'react'
import Moment from 'react-moment'
import 'moment-timezone'
import { FaBitcoin, FaDollar } from 'react-icons/lib/fa'
import { MdCheck } from 'react-icons/lib/md'
import QRCode from 'qrcode.react'
import Modal from './Modal'
import { btc } from '../../../../utils'
import styles from './Invoices.scss'

class Invoices extends Component {
	render() {
		const {
      invoice,
      invoices,
      ticker,
      setInvoice,
      invoiceModalOpen
    } = this.props

		return (
      <div>
        <Modal isOpen={invoiceModalOpen} resetObject={setInvoice}>
          {
            invoice ?
              <div className={styles.invoiceModal}>
                <h3>{invoice.memo}</h3>
                <h1>
                  {
                    ticker.currency === 'btc' ?
                      <FaBitcoin style={{ verticalAlign: 'top' }} />
                    :
                      <FaDollar style={{ verticalAlign: 'top' }} />
                  }
                  <span className={styles.value}>
                    {
                      ticker.currency === 'btc' ?
                        btc.satoshisToBtc(invoice.value)
                      :
                        btc.satoshisToUsd(invoice.value, ticker.btcTicker.price_usd)
                    }
                  </span>
                </h1>
                <div className={styles.qrcode}>
                  <QRCode value={invoice.payment_request} size={200} />
                  <input
                    readOnly
                    className={styles.paymentRequest}
                    onClick={(event) => event.target.select()}
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
                  <Moment format='MMM Do'>
                    {invoice.creation_date * 1000}
                  </Moment>
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
            invoices.map((invoice, index) =>
              <li key={index} className={styles.invoice} onClick={() => setInvoice(invoice)}>
                <div className={styles.left}>
                  <div className={styles.path}>{`${invoice.payment_request.substring(0, 75)}...`}</div>
                </div>
                <div className={styles.center}>
                  <div>{invoice.memo}</div>
                </div>
                <div className={styles.right}>
                  <div className={invoice.settled ? styles.settled : null}>
                    {
                      ticker.currency === 'btc' ?
                        btc.satoshisToBtc(invoice.value)
                      :
                        btc.satoshisToUsd(invoice.value, ticker.btcTicker.price_usd) 
                    }
                  </div>
                </div>
              </li>
            )
          }
        </ul>
      </div>
		)
	}
}

export default Invoices
