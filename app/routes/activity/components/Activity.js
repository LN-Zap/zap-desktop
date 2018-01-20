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
      fetchPayments, fetchInvoices, fetchTransactions, fetchBalance
    } = this.props

    fetchBalance()
    fetchPayments()
    fetchInvoices()
    fetchTransactions()
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
      searchInvoices,
      invoice: { invoicesSearchText, invoiceLoading },
      address: { address },
      balance,
      info,
      payment: { paymentLoading },
      currentTicker,
      activity: { modal, filter, filterPulldown },
      hideActivityModal,
      changeFilter,
      toggleFilterPulldown,
      currentActivity,
      nonActiveFilters,
      newAddress
    } = this.props

    if (invoiceLoading || paymentLoading) { return <LoadingBolt /> }
    if (balance.balanceLoading) { return <LoadingBolt /> }
    if (!balance.channelBalance || !balance.walletBalance) { return <LoadingBolt /> }

    return (
      <div>
        <Modal
          modalType={modal.modalType}
          modalProps={modal.modalProps}
          hideActivityModal={hideActivityModal}
          ticker={ticker}
          currentTicker={currentTicker}
        />

        <Wallet balance={balance} address={address} info={info} newAddress={newAddress} />

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
            <section>
              <h2 onClick={toggleFilterPulldown}>
                {filter.name} <span className={filterPulldown && styles.pulldown}><FaAngleDown /></span>
              </h2>
              <ul className={`${styles.filters} ${filterPulldown && styles.active}`}>
                {
                  nonActiveFilters.map(f => (
                    <li key={f.key} onClick={() => changeFilter(f)}>
                      {f.name}
                    </li>
                  ))
                }
              </ul>
            </section>
          </header>
          {(currentActivity.length == 0
          ? <div className={`${styles.emptyMessage}`}>No activity to show.</div>
          : (<ul className={`${styles.activityContainer} ${filterPulldown && styles.pulldown}`}>
            {
              currentActivity.map((activity, index) => (
                <li className={styles.activity} key={index}>
                  {this.renderActivity(activity)}
                </li>
              ))
            }
            </ul>)
          )}
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
  searchInvoices: PropTypes.func.isRequired,
  invoice: PropTypes.object.isRequired,
  payment: PropTypes.object.isRequired,
  currentTicker: PropTypes.object.isRequired,

  showActivityModal: PropTypes.func.isRequired,
  hideActivityModal: PropTypes.func.isRequired,
  changeFilter: PropTypes.func.isRequired,
  newAddress: PropTypes.func.isRequired,
  toggleFilterPulldown: PropTypes.func.isRequired,

  activity: PropTypes.object.isRequired,
  currentActivity: PropTypes.array.isRequired,
  nonActiveFilters: PropTypes.array.isRequired,
  address: PropTypes.object.isRequired,
  balance: PropTypes.object.isRequired,
  info: PropTypes.object.isRequired
}

export default Activity
