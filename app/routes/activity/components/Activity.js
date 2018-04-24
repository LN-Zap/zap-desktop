import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Wallet from 'components/Wallet'
import LoadingBolt from 'components/LoadingBolt'
import Invoice from './components/Invoice'
import Payment from './components/Payment'
import Transaction from './components/Transaction'

import styles from './Activity.scss'

class Activity extends Component {
  constructor(props, context) {
    super(props, context)
    this.renderActivity = this.renderActivity.bind(this)
  }

  componentWillMount() {
    const {
      fetchPayments, fetchInvoices, fetchTransactions, fetchBalance
    } = this.props

    fetchBalance()
    fetchPayments()
    fetchInvoices()
    fetchTransactions()
  }

  renderActivity(activity) {
    const {
      ticker,
      currentTicker,
      showActivityModal,
      network,
      currencyName
    } = this.props

    if (Object.prototype.hasOwnProperty.call(activity, 'block_hash')) {
      // activity is an on-chain tx
      return (
        <Transaction
          transaction={activity}
          ticker={ticker}
          currentTicker={currentTicker}
          showActivityModal={showActivityModal}
          currencyName={currencyName}
        />
      )
    } else if (Object.prototype.hasOwnProperty.call(activity, 'payment_request')) {
      // activity is an LN invoice
      return <Invoice invoice={activity} ticker={ticker} currentTicker={currentTicker} showActivityModal={showActivityModal} />
    }
    // activity is an LN payment
    return (
      <Payment
        payment={activity}
        ticker={ticker}
        currentTicker={currentTicker}
        showActivityModal={showActivityModal}
        nodes={network.nodes}
        currencyName={currencyName}
      />
    )
  }

  render() {
    const {
      balance,
      activity: {
        filters,
        filter,
        filterPulldown
      },
      changeFilter,
      currentActivity,

      network,

      walletProps
    } = this.props

    console.log('network: ', network)
    if (!balance.channelBalance || !balance.walletBalance) { return <LoadingBolt /> }

    return (
      <div>
        <Wallet {...walletProps} />

        <div className={styles.activities}>
          <header className={styles.header}>
            <section>
              <ul className={styles.filters}>
                {
                  filters.map(f => (
                    <li key={f.key} className={f.key === filter.key && styles.activeFilter} onClick={() => changeFilter(f)}>
                      <span>{f.name}</span>

                      <div className={f.key === filter.key && styles.activeBorder} />
                    </li>
                  ))
                }
              </ul>
            </section>
          </header>
          <ul className={`${styles.activityContainer} ${filterPulldown && styles.pulldown}`}>
            {
              currentActivity.map((activityBlock, index) => (
                <li className={styles.activity} key={index}>
                  <h2>{activityBlock.title}</h2>
                  <ul>
                    {
                      activityBlock.activity.map(activity => <li>{this.renderActivity(activity.el)}</li>)
                    }
                  </ul>
                </li>
              ))
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
  fetchTransactions: PropTypes.func.isRequired,
  fetchBalance: PropTypes.func.isRequired,

  ticker: PropTypes.object.isRequired,
  currentTicker: PropTypes.object.isRequired,

  showActivityModal: PropTypes.func.isRequired,
  changeFilter: PropTypes.func.isRequired,

  activity: PropTypes.object.isRequired,
  currentActivity: PropTypes.array.isRequired,
  balance: PropTypes.object.isRequired,
  walletProps: PropTypes.object.isRequired
}

export default Activity
