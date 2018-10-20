import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Search from 'components/Icon/Search'
import X from 'components/Icon/X'
import FaRepeat from 'react-icons/lib/fa/repeat'

import { FormattedMessage, injectIntl } from 'react-intl'
import { Flex } from 'rebass'
import { Button } from 'components/UI'
import Wallet from 'components/Wallet'
import Invoice from './Invoice'
import Payment from './Payment'
import Transaction from './Transaction'

import styles from './Activity.scss'

import messages from './messages'

class Activity extends Component {
  constructor(props) {
    super(props)
    this.renderActivity = this.renderActivity.bind(this)

    this.state = {
      refreshing: false
    }
  }

  componentWillMount() {
    const {
      fetchPayments,
      fetchInvoices,
      fetchTransactions,
      fetchBalance,
      fetchChannels
    } = this.props

    fetchBalance()
    fetchPayments()
    fetchInvoices()
    fetchTransactions()
    fetchChannels()

    // HACK: wait 10 seconds and fetch channels again, allowing the node to establish connections with the remote party
    setTimeout(() => fetchChannels(), 10000)
  }

  renderActivity(activity) {
    const { ticker, currentTicker, showActivityModal, network, currencyName } = this.props

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
      return (
        <Invoice
          invoice={activity}
          ticker={ticker}
          currentTicker={currentTicker}
          showActivityModal={showActivityModal}
          currencyName={currencyName}
        />
      )
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
      activity: { filters, filter, filterPulldown, searchActive, searchText, showExpiredRequests },
      changeFilter,
      currentActivity,
      currentTicker,
      showExpiredToggle,
      toggleExpiredRequests,

      fetchPayments,
      fetchInvoices,
      fetchTransactions,
      fetchBalance,

      updateSearchActive,
      updateSearchText,
      walletProps,
      intl
    } = this.props

    if (!currentTicker || balance.channelBalance === null || balance.walletBalance === null) {
      return null
    }

    const refreshClicked = () => {
      // turn the spinner on
      this.setState({ refreshing: true })

      // store event in icon so we dont get an error when react clears it
      const icon = this.repeat.childNodes

      // fetch data
      fetchBalance()
      fetchPayments()
      fetchInvoices()
      fetchTransactions()

      // wait for the svg to appear as child
      const svgTimeout = setTimeout(() => {
        if (icon[0].tagName === 'svg') {
          // spin icon for 1 sec
          icon[0].style.animation = 'spin 1000ms linear 1'
          clearTimeout(svgTimeout)
        }
      }, 1)

      // clear animation after the second so we can reuse it
      const refreshTimeout = setTimeout(() => {
        icon[0].style.animation = ''
        this.setState({ refreshing: false })
        clearTimeout(refreshTimeout)
      }, 1000)
    }

    const { refreshing } = this.state
    return (
      <div>
        <Wallet {...walletProps} />

        <div className={styles.activities}>
          {searchActive ? (
            <header className={`${styles.header} ${styles.search}`}>
              <section>
                <input
                  placeholder={intl.formatMessage({ ...messages.search })}
                  value={searchText}
                  onChange={event => updateSearchText(event.target.value)}
                />
              </section>
              <section
                onClick={() => {
                  updateSearchActive(false)
                  updateSearchText('')
                }}
              >
                <span className={styles.xIcon}>
                  <X />
                </span>
              </section>
            </header>
          ) : (
            <header className={styles.header}>
              <section>
                <ul className={styles.filters}>
                  {filters.map(f => (
                    <li
                      key={f.key}
                      className={f.key === filter.key ? styles.activeFilter : undefined}
                      onClick={() => changeFilter(f)}
                    >
                      <FormattedMessage {...messages[f.name]} />

                      <div className={f.key === filter.key ? styles.activeBorder : undefined} />
                    </li>
                  ))}
                </ul>
              </section>
              <section>
                <ul className={styles.actions}>
                  <li onClick={refreshClicked}>
                    <span
                      className={styles.refresh}
                      ref={ref => {
                        this.repeat = ref
                      }}
                    >
                      {refreshing ? <FaRepeat /> : <FormattedMessage {...messages.refresh} />}
                    </span>
                  </li>
                  <li className={styles.activeFilter} onClick={() => updateSearchActive(true)}>
                    <Search />
                  </li>
                </ul>
              </section>
            </header>
          )}
          <ul
            className={`${styles.activityContainer} ${
              filterPulldown ? styles.pulldown : undefined
            }`}
          >
            {currentActivity.map((activityBlock, index) => (
              <li className={styles.activity} key={index}>
                <h2>{activityBlock.title}</h2>
                <ul>
                  {activityBlock.activity.map((activity, i) => (
                    <li key={i}>{this.renderActivity(activity.el)}</li>
                  ))}
                </ul>
              </li>
            ))}
            {showExpiredToggle &&
              currentActivity.length > 0 && (
                <Flex justifyContent="center">
                  <Button onClick={toggleExpiredRequests} mx="auto">
                    {showExpiredRequests ? (
                      <FormattedMessage {...messages.hide_expired} />
                    ) : (
                      <FormattedMessage {...messages.show_expired} />
                    )}
                  </Button>
                </Flex>
              )}
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
  fetchChannels: PropTypes.func.isRequired,

  ticker: PropTypes.object.isRequired,
  currentTicker: PropTypes.object,
  network: PropTypes.object.isRequired,

  showActivityModal: PropTypes.func.isRequired,
  changeFilter: PropTypes.func.isRequired,
  updateSearchActive: PropTypes.func.isRequired,
  updateSearchText: PropTypes.func.isRequired,
  toggleExpiredRequests: PropTypes.func.isRequired,

  activity: PropTypes.object.isRequired,
  currentActivity: PropTypes.array.isRequired,
  showExpiredToggle: PropTypes.bool.isRequired,
  balance: PropTypes.object.isRequired,
  walletProps: PropTypes.object.isRequired,

  currencyName: PropTypes.string.isRequired
}

export default injectIntl(Activity)
