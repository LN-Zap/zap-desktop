// @flow
import React, { Component } from 'react'
import Moment from 'react-moment'
import 'moment-timezone'
import { satoshisToBtc } from '../../../../utils/bitcoin'
import styles from './Payments.scss'

class Payments extends Component {
	render() {
		const { payments } = this.props
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
          payments.map((payment, index) => (
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
                  <span className={styles.fee}>{payment.fee === '0' ? '0' : satoshisToBtc(payment.fee, 2500)}</span>
                </div>
                <div className={styles.right}>
                  <span className={styles.value}>{satoshisToBtc(payment.value, 2500)}</span>
                </div>
              </li>
            )
          )
        }
      </ul>
		)
	}
}

export default Payments