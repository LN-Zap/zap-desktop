import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'
import 'moment-timezone'
import Modal from './Modal'
import CurrencyIcon from '../../../../components/CurrencyIcon'
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
              <CurrencyIcon currency={ticker.currency} crypto={ticker.crypto} styles={{ verticalAlign: 'top' }} />
              <span className={styles.value}>
                {
                  ticker.currency === 'usd' ?
                    btc.satoshisToUsd(payment.value, currentTicker.price_usd)
                    :
                    btc.satoshisToBtc(payment.value)
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
                <Moment format='MMM Do'>{paymentItem.creation_date * 1000}</Moment>
              </div>
            </div>
            <div className={styles.right}>
              <span className={styles.fee}>
                {
                  ticker.currency === 'usd' ?
                    btc.satoshisToUsd(paymentItem.fee, currentTicker.price_usd)
                    :
                    btc.satoshisToBtc(paymentItem.fee)
                }
              </span>
            </div>
            <div className={styles.right}>
              <span className={styles.value}>
                {
                  ticker.currency === 'usd' ?
                    btc.satoshisToUsd(paymentItem.value, currentTicker.price_usd)
                    :
                    btc.satoshisToBtc(paymentItem.value)
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
  paymentModalOpen: PropTypes.bool.isRequired,
  currentTicker: PropTypes.object.isRequired
}

export default Payments
