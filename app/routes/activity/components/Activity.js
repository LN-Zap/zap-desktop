// @flow
import React, { Component } from 'react'
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
import { MdSearch } from 'react-icons/lib/md'
import Payments from './components/Payments'
import Invoices from './components/Invoices'
import styles from './Activity.scss'

class Activity extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      tab: 1
    }
  }

  componentWillMount() {
    const { fetchPayments, fetchInvoices } = this.props

    fetchPayments()
    fetchInvoices()
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
      invoiceModalOpen
    } = this.props

    if (invoiceLoading || paymentLoading) { return <div>Loading...</div> }
    return (
      <div>
        <div className={styles.search}>
        	<label className={`${styles.label} ${styles.input}`}>
        		<MdSearch />
        	</label>
        	<input
            value={tab === 1 ? '' : invoicesSearchText}
            onChange={event => tab === 1 ? null : searchInvoices(event.target.value)}
            className={`${styles.text} ${styles.input}`}
            placeholder={tab === 1 ? 'Search transactions by amount, public key, channel' : 'Search requests by memo'}
            type='text'
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
          <div className={styles.activityContainer}>
            {
              tab === 1 ?
                <Payments
                  key={1}
                  payment={payment}
                  payments={payments}
                  ticker={ticker}
                  setPayment={setPayment}
                  paymentModalOpen={paymentModalOpen}
                />
              :
                <Invoices
                  key={2}
                  invoice={invoice}
                  invoices={invoices}
                  ticker={ticker}
                  setInvoice={setInvoice}
                  invoiceModalOpen={invoiceModalOpen}
                />
            }
          </div>
        </div>
      </div>
    )
  }
}

export default Activity
