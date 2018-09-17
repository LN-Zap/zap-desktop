import React from 'react'
import PropTypes from 'prop-types'

import Isvg from 'react-inlinesvg'
import hand from 'icons/hand.svg'
import FaAngleDown from 'react-icons/lib/fa/angle-down'

import { btc } from 'lib/utils'
import AmountInput from 'components/AmountInput'

import { FormattedMessage, injectIntl } from 'react-intl'
import messages from './messages'

import styles from './Request.scss'

const Request = ({
  requestform: { amount, memo, showCurrencyFilters },
  ticker,

  setRequestAmount,
  setRequestMemo,
  setCurrency,
  setRequestCurrencyFilters,
  currencyName,
  requestFiatAmount,

  currentCurrencyFilters,

  onRequestSubmit,
  intl
}) => {
  const onCurrencyFilterClick = currency => {
    // change the input amount
    setRequestAmount(btc.convert(ticker.currency, currency, amount))

    setCurrency(currency)
    setRequestCurrencyFilters(false)
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Isvg src={hand} />
        <h1>
          <FormattedMessage {...messages.title} />
        </h1>
      </header>

      <div className={styles.content}>
        <section className={styles.amount}>
          <div className={styles.top}>
            <label htmlFor="amount">
              <FormattedMessage {...messages.amount} />
            </label>
            <span />
          </div>
          <div className={styles.bottom}>
            <AmountInput
              id="amount"
              amount={amount}
              currency={ticker.currency}
              onChangeEvent={setRequestAmount}
            />
            <div className={styles.currency}>
              <section
                className={styles.currentCurrency}
                onClick={() => setRequestCurrencyFilters(!showCurrencyFilters)}
              >
                <span>{currencyName}</span>
                <span>
                  <FaAngleDown />
                </span>
              </section>
              <ul className={showCurrencyFilters ? styles.active : undefined}>
                {currentCurrencyFilters.map(filter => (
                  <li key={filter.key} onClick={() => onCurrencyFilterClick(filter.key)}>
                    {filter.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.fiatAmount}>{`≈ ${requestFiatAmount || 0} ${
            ticker.fiatTicker
          }`}</div>
        </section>

        <section className={styles.memo}>
          <div className={styles.top}>
            <label htmlFor="memo">
              <FormattedMessage {...messages.memo} />
            </label>
          </div>
          <div className={styles.bottom}>
            <input
              type="text"
              placeholder={intl.formatMessage({ ...messages.details })}
              value={memo}
              onChange={event => setRequestMemo(event.target.value)}
              id="memo"
            />
          </div>
        </section>

        <section className={styles.submit}>
          <div
            className={`${styles.button} ${amount > 0 ? styles.active : undefined}`}
            onClick={onRequestSubmit}
          >
            <FormattedMessage {...messages.request} />
          </div>
        </section>
      </div>
    </div>
  )
}

Request.propTypes = {
  requestform: PropTypes.shape({
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    memo: PropTypes.string
  }).isRequired,

  requestFiatAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  currencyName: PropTypes.string.isRequired,

  currentCurrencyFilters: PropTypes.array.isRequired,

  setRequestAmount: PropTypes.func.isRequired,
  setRequestMemo: PropTypes.func.isRequired,
  onRequestSubmit: PropTypes.func.isRequired,
  setCurrency: PropTypes.func.isRequired,
  setRequestCurrencyFilters: PropTypes.func.isRequired,

  ticker: PropTypes.object.isRequired
}

export default injectIntl(Request)
