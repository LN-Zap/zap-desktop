import React from 'react'
import PropTypes from 'prop-types'
import { btc } from 'utils'
import styles from './TransactionForm.scss'

const TransactionForm = ({ updatePayReq, pay_req, loadingRoutes, payReqRoutes, setCurrentRoute, currentRoute }) => (
  <div className={styles.transactionForm}>
    <div className={styles.form}>
      <input
        className={styles.transactionInput}
        placeholder='Payment request...'
        value={pay_req}
        onChange={event => updatePayReq(event.target.value)}
      />
    </div>

    {
      loadingRoutes &&
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <h1>calculating all routes...</h1>
      </div>
    }

    <ul className={styles.routes}>
      {
        payReqRoutes.map((route, index) => 
          <li className={`${styles.route} ${currentRoute == route && styles.active}`} key={index} onClick={() => setCurrentRoute(route)}>
            <header>
              <h1>Route #{index + 1}</h1>
              <span>Hops: {route.hops.length}</span>
            </header>

            <div className={styles.data}>
              <section>
                <h4>Amount</h4>
                <span>{btc.satoshisToBtc(route.total_amt)} BTC</span>
              </section>

              <section>
                <h4>Fees</h4>
                <span>{btc.satoshisToBtc(route.total_fees)} BTC</span>
              </section>
            </div>
          </li>
        )
      }
    </ul>
  </div>
)

TransactionForm.propTypes = {
  updatePayReq: PropTypes.func.isRequired,
  pay_req: PropTypes.string.isRequired,
  loadingRoutes: PropTypes.bool.isRequired,
  payReqRoutes: PropTypes.array.isRequired,
  setCurrentRoute: PropTypes.func.isRequired
}

export default TransactionForm
