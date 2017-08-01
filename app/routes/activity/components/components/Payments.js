// @flow
import React, { Component } from 'react'
import Moment from 'react-moment'
import 'moment-timezone'
import { btc } from '../../../../utils'
import styles from './Payments.scss'

class Payments extends Component {
	render() {
		const { payments, ticker } = this.props
		return (
			<ul className={styles.payments}>
        <li className={styles.paymentTitles}>
          <div className={styles.left}>
            <div>Public Key</div>
          </div>
          <div className={styles.center}>
            <div>Date</div>
          </div>
          <div className={styles.center}>
            <div>Fee</div>
          </div>
          <div className={styles.right}>
            <div>Amount</div>
          </div>
        </li>
        {
          payments.map((payment, index) =>
            <li key={index} className={styles.payment}>
              <div className={styles.left}>
                <div className={styles.path}>{payment.path[0]}</div>
              </div>
              <div className={styles.center}>
                <div className={styles.date}>
                  <Moment format="MMMM Do">{payment.creation_date * 1000}</Moment>
                </div>
              </div>
              <div className={styles.right}>
                <span className={styles.fee}>
                {
                  ticker.currency === 'btc' ?
                    btc.satoshisToBtc(payment.fee)
                  :
                    btc.satoshisToUsd(payment.fee, ticker.btcTicker.price_usd) 
                }
                </span>
              </div>
              <div className={styles.right}>
                <span className={styles.value}>
                  {
                    ticker.currency === 'btc' ?
                      btc.satoshisToBtc(payment.value)
                    :
                      btc.satoshisToUsd(payment.value, ticker.btcTicker.price_usd) 
                  }
                </span>
              </div>
            </li>
          )
        }
      </ul>
		)
	}
}

export default Payments