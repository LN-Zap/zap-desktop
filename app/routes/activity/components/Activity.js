import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { MdSearch } from 'react-icons/lib/md'
import { FaChain, FaBolt } from 'react-icons/lib/fa'

import Invoice from './components/Invoice'
import Payment from './components/Payment'
import Transaction from './components/Transaction'

import Modal from './components/Modal'

import styles from './Activity.scss'

class Activity extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      pulldown: false
    }

    this.renderActivity = this.renderActivity.bind(this)
  }

  componentWillMount() {
    const { fetchPayments, fetchInvoices, fetchTransactions } = this.props

    fetchPayments()
    fetchInvoices()
    fetchTransactions()
  }

  renderActivity(activity) {
    const { ticker, currentTicker, showActivityModal } = this.props

    if (activity.hasOwnProperty('block_hash')) {
      // activity is an on-chain tx
      return <Transaction transaction={activity} ticker={ticker} currentTicker={currentTicker} showActivityModal={showActivityModal} />
    } else if (activity.hasOwnProperty('payment_request')) {
      // activity is an LN invoice
      return <Invoice invoice={activity} ticker={ticker} currentTicker={currentTicker} showActivityModal={showActivityModal} />
    } else {
      // activity is an LN payment
      return <Payment payment={activity} ticker={ticker} currentTicker={currentTicker} showActivityModal={showActivityModal} />
    }
  }

  render() {
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
      activity: { modal },
      hideActivityModal,
      currentActivity,
      nonActiveFilters
    } = this.props

    if (invoiceLoading || paymentLoading) { return <div>Loading...</div> }

    return (
      <div>
        <Modal
          modalType={modal.modalType}
          modalProps={modal.modalProps}
          hideActivityModal={hideActivityModal}
          ticker={ticker}
          currentTicker={currentTicker}
        />
        
        <div className={styles.search}>
          <label className={`${styles.label} ${styles.input}`} htmlFor='invoiceSearch'>
            <MdSearch />
          </label>
          <input
            value={invoicesSearchText}
            onChange={event => searchInvoices(event.target.value)}
            className={`${styles.text} ${styles.input}`}
            placeholder='Search by amount, hash, memo, etc'
            type='text'
            id='invoiceSearch'
          />
        </div>

        <div className={styles.activities}>
          <header className={styles.header}>
            <h2 onClick={() => this.setState({ pulldown: true })}>Activity</h2>
            <ul className={styles.filters}>
              {
                nonActiveFilters.map(filter => {
                  console.log('filter: ', filter)
                  return (
                    <li key={filter.key}>
                      {filter.name}
                    </li>
                  )
                })
              }
            </ul>
          </header>
          <ul className={styles.activityContainer}>
            {
              currentActivity.map((activity, index) => {
                return (
                  <li className={styles.activity} key={index}>
                    {this.renderActivity(activity)}
                  </li>
                )
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
