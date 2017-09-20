import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { MdSearch } from 'react-icons/lib/md'
import { FaChain, FaBolt } from 'react-icons/lib/fa'
import Payments from './components/Payments'
import Invoices from './components/Invoices'

import Invoice from './components/Invoice'
import Payment from './components/Payment'
import Transaction from './components/Transaction'

import styles from './Activity.scss'

class Activity extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      tab: 1
    }
  }

  componentWillMount() {
    const { fetchPayments, fetchInvoices, fetchTransactions } = this.props

    fetchPayments()
    fetchInvoices()
    fetchTransactions()
  }

  render() {
    const { tab } = this.state
    const {
      ticker,
      searchInvoices,
      invoices,
      invoice: { invoicesSearchText, invoice, invoiceLoading },
      payment: { payment, payments, paymentLoading },
      setPayment,
      setInvoice,
      paymentModalOpen,
      invoiceModalOpen,
      currentTicker,
      sortedActivity
    } = this.props
    if (invoiceLoading || paymentLoading) { return <div>Loading...</div> }
    return (
      <div>
        <div className={styles.search}>
          <label className={`${styles.label} ${styles.input}`} htmlFor='invoiceSearch'>
            <MdSearch />
          </label>
          <input
            value={tab === 1 ? '' : invoicesSearchText}
            onChange={event => (tab === 1 ? null : searchInvoices(event.target.value))}
            className={`${styles.text} ${styles.input}`}
            placeholder={tab === 1 ? 'Search transactions by amount, public key, channel' : 'Search requests by memo'}
            type='text'
            id='invoiceSearch'
          />
        </div>

        <div className={styles.activities}>
          <header className={styles.header}>
            <span
              className={`${styles.title} ${tab === 1 ? styles.active : null}`}
              onClick={() => this.setState({ tab: 1 })}
            >
              Payments
            </span>
            <span
              className={`${styles.title} ${tab === 2 ? styles.active : null}`}
              onClick={() => this.setState({ tab: 2 })}
            >
              Requests
            </span>
          </header>
          <ul className={styles.activityContainer}>
            {
              sortedActivity.map((activity, index) => {
                if (activity.hasOwnProperty('block_hash')) {
                  // activity is an on-chain tx
                  return <Transaction transaction={activity} key={index} />
                } else if (activity.hasOwnProperty('payment_request')) {
                  // activity is an LN invoice
                  return <Invoice invoice={activity} key={index} />
                } else {
                  // activity is an LN payment
                  return <Payment payment={activity} key={index} />
                }
              })
            }
          </ul>
        </div>
      </div>
    )
  }
}

Activity.propTypes = {
  fetchPayments: PropTypes.func.isRequired,
  fetchInvoices: PropTypes.func.isRequired,
  ticker: PropTypes.object.isRequired,
  searchInvoices: PropTypes.func.isRequired,
  invoices: PropTypes.array.isRequired,
  invoice: PropTypes.object.isRequired,
  payment: PropTypes.object.isRequired,
  setPayment: PropTypes.func.isRequired,
  setInvoice: PropTypes.func.isRequired,
  paymentModalOpen: PropTypes.bool.isRequired,
  invoiceModalOpen: PropTypes.bool.isRequired,
  currentTicker: PropTypes.object.isRequired
}

export default Activity
