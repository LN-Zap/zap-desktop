import React from 'react'
import PropTypes from 'prop-types'

import Hand from 'components/Icon/Hand'

import { btc } from 'lib/utils'
import AmountInput from 'components/AmountInput'
import Button from 'components/UI/Button'
import Dropdown from 'components/UI/Dropdown'

import { FormattedNumber, FormattedMessage, injectIntl } from 'react-intl'
import messages from './messages'

import styles from './Request.scss'

const Request = ({
  requestform: { amount, memo },
  ticker,
  setRequestAmount,
  setRequestMemo,
  setCurrency,
  requestFiatAmount,
  currencyFilters,
  onRequestSubmit,
  intl
}) => {
  const onCurrencyFilterClick = currency => {
    // change the input amount
    setRequestAmount(btc.convert(ticker.currency, currency, amount))
    setCurrency(currency)
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Hand width="3em" height="3em" />
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
            <Dropdown
              activeKey={ticker.currency}
              items={currencyFilters}
              onChange={onCurrencyFilterClick}
              ml={2}
            />
          </div>

          <div className={styles.fiatAmount}>
            {'≈ '}
            <FormattedNumber
              currency={ticker.fiatTicker}
              style="currency"
              value={requestFiatAmount || 0}
            />
          </div>
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
          <Button disabled={!(amount > 0)} onClick={onRequestSubmit} size="large" width={200}>
            <FormattedMessage {...messages.request} />
          </Button>
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
  currencyFilters: PropTypes.array.isRequired,
  setRequestAmount: PropTypes.func.isRequired,
  setRequestMemo: PropTypes.func.isRequired,
  onRequestSubmit: PropTypes.func.isRequired,
  setCurrency: PropTypes.func.isRequired,

  ticker: PropTypes.object.isRequired
}

export default injectIntl(Request)
