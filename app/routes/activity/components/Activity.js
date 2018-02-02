import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { MdSearch } from 'react-icons/lib/md'
import { FaAngleDown } from 'react-icons/lib/fa'

import Wallet from 'components/Wallet'
import LoadingBolt from 'components/LoadingBolt'
import Invoice from './components/Invoice'
import Payment from './components/Payment'
import Transaction from './components/Transaction'

import Modal from './components/Modal'

import styles from './Activity.scss'

class Activity extends Component {
  constructor(props, context) {
    super(props, context)
    this.renderActivity = this.renderActivity.bind(this)
  }

  componentWillMount() {
    const {
      fetchPayments, fetchInvoices, fetchTransactions, fetchBalance, fetchChannels
    } = this.props

    fetchBalance()
    fetchPayments()
    fetchInvoices()
    fetchTransactions()
    fetchChannels()
  }

  renderActivity(activity) {
    const { ticker, currentTicker, showActivityModal } = this.props

    if (Object.prototype.hasOwnProperty.call(activity, 'block_hash')) {
      // activity is an on-chain tx
      return <Transaction transaction={activity} ticker={ticker} currentTicker={currentTicker} showActivityModal={showActivityModal} />
    } else if (Object.prototype.hasOwnProperty.call(activity, 'payment_request')) {
      // activity is an LN invoice
      return <Invoice invoice={activity} ticker={ticker} currentTicker={currentTicker} showActivityModal={showActivityModal} />
    }
    // activity is an LN payment
    return <Payment payment={activity} ticker={ticker} currentTicker={currentTicker} showActivityModal={showActivityModal} />
  }

  render() {
    const {
      ticker,
      updateSearchText,
      invoice: { invoiceLoading },
      address: { address },
      balance,
      info,
      payment: { paymentLoading },
      currentTicker,
      activity: { modal, filters, filter, filterPulldown, searchText },
      hideActivityModal,
      changeFilter,
      toggleFilterPulldown,
      currentActivity,
      nonActiveFilters,
      newAddress,
      openPayForm,
      openRequestForm
    } = this.props

    if (invoiceLoading || paymentLoading) { return <LoadingBolt /> }
    if (balance.balanceLoading) { return <LoadingBolt /> }
    if (!balance.channelBalance || !balance.walletBalance) { return <LoadingBolt /> }

    return (
      <div style={{ height: '100%' }}>
        <Modal
          modalType={modal.modalType}
          modalProps={modal.modalProps}
          hideActivityModal={hideActivityModal}
          ticker={ticker}
          currentTicker={currentTicker}
        />

        <Wallet
          balance={balance}
          address={address}
          info={info}
          newAddress={newAddress}
          currentTicker={currentTicker}
          openPayForm={openPayForm}
          openRequestForm={openRequestForm}
        />

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
              currentActivity.map((activity, index) => (
                <li className={styles.activity} key={index}>
                  {this.renderActivity(activity)}
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
  updateSearchText: PropTypes.func.isRequired,
  invoice: PropTypes.object.isRequired,
  payment: PropTypes.object.isRequired,
  currentTicker: PropTypes.object.isRequired,

  showActivityModal: PropTypes.func.isRequired,
  hideActivityModal: PropTypes.func.isRequired,
  changeFilter: PropTypes.func.isRequired,
  newAddress: PropTypes.func.isRequired,
  toggleFilterPulldown: PropTypes.func.isRequired,
  openPayForm: PropTypes.func.isRequired,
  openRequestForm: PropTypes.func.isRequired,

  activity: PropTypes.object.isRequired,
  currentActivity: PropTypes.array.isRequired,
  nonActiveFilters: PropTypes.array.isRequired,
  address: PropTypes.object.isRequired,
  balance: PropTypes.object.isRequired,
  info: PropTypes.object.isRequired
}

export default Activity
