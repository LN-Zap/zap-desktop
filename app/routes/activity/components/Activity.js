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
      tab: 2
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
      invoice: { invoice, invoices, invoiceLoading },
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
        	<input className={`${styles.text} ${styles.input}`} placeholder='Search transactions by amount, public key, channel' type='text' />
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
            <CSSTransitionGroup 
              transitionName='activity'
              transitionEnterTimeout={500}
              transitionLeaveTimeout={500}
            >
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
            </CSSTransitionGroup>
          </div>
        </div>
      </div>
    )
  }
}


export default Activity