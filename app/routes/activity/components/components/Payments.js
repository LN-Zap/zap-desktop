import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'
import 'moment-timezone'
import { FaBitcoin, FaDollar } from 'react-icons/lib/fa'
import Modal from './Modal'
import { btc } from '../../../../utils'
import styles from './Payments.scss'

const Payments = ({
  payment,
  payments,
  ticker,
  setPayment,
  paymentModalOpen,
  currentTicker
}) => (
  <div>
    <Modal isOpen={paymentModalOpen} resetObject={setPayment}>
      {
        payment ?
          <div className={styles.paymentModal}>
            <h3>{payment.payment_hash}</h3>
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
                    btc.satoshisToBtc(payment.value)
                    :
                    btc.satoshisToUsd(payment.value, currentTicker.price_usd)
                }
              </span>
            </h1>
            <dl>
              <dt>Fee</dt>
              <dd>{payment.fee}</dd>
              <dt>Date</dt>
              <dd>
                <Moment format='MMM Do'>{payment.creation_date * 1000}</Moment>
              </dd>
            </dl>
          </div>
          :
          null
      }
    </Modal>
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
        payments.map((paymentItem, index) =>
          (<li key={index} className={styles.payment} onClick={() => setPayment(paymentItem)}>
            <div className={styles.left}>
              <div className={styles.path}>{paymentItem.path[0]}</div>
            </div>
            <div className={styles.center}>
              <div className={styles.date}>
                <Moment format='MMMM Do'>{paymentItem.creation_date * 1000}</Moment>
              </div>
            </div>
            <div className={styles.right}>
              <span className={styles.fee}>
                {
                  ticker.currency === 'btc' ?
                    btc.satoshisToBtc(paymentItem.fee)
                    :
                    btc.satoshisToUsd(paymentItem.fee, currentTicker.price_usd)
                }
              </span>
            </div>
            <div className={styles.right}>
              <span className={styles.value}>
                {
                  ticker.currency === 'btc' ?
                    btc.satoshisToBtc(paymentItem.value)
                    :
                    btc.satoshisToUsd(paymentItem.value, currentTicker.price_usd)
                }
              </span>
            </div>
          </li>)
        )
      }
    </ul>
  </div>
)

Payments.propTypes = {
  payment: PropTypes.object,
  payments: PropTypes.array.isRequired,
  ticker: PropTypes.object.isRequired,
  setPayment: PropTypes.func.isRequired,
  paymentModalOpen: PropTypes.bool.isRequired
}

export default Payments
