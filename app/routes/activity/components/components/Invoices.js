// @flow
import React, { Component } from 'react'
import Moment from 'react-moment'
import 'moment-timezone'
import { satoshisToBtc } from '../../../../utils/bitcoin'
import styles from './Invoices.scss'

class Invoices extends Component {
	render() {
		const { invoices } = this.props
		return (
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
          invoices.map((invoice, index) => (
              <li key={index} className={styles.invoice}>
                <div className={styles.left}>
                  <div className={styles.path}>{`${invoice.payment_request.substring(0, 75)}...`}</div>
                </div>
                <div className={styles.center}>
                  <div>{invoice.memo}</div>
                </div>
                <div className={styles.right}>
                  <div className={invoice.settled ? styles.settled : null}>{satoshisToBtc(invoice.value, 2500)}</div>
                </div>
              </li>
            )
          )
        }
      </ul>
		)
	}
}

export default Invoices