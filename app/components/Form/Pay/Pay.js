import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Isvg from 'react-inlinesvg'
import paperPlane from 'icons/paper_plane.svg'
import link from 'icons/link.svg'
import { MdKeyboardArrowDown } from 'react-icons/md'

import { btc } from 'lib/utils'
import AmountInput from 'components/AmountInput'

import { FormattedMessage, injectIntl } from 'react-intl'
import messages from './messages'

import styles from './Pay.scss'

class Pay extends Component {
  componentDidUpdate(prevProps) {
    const {
      isLn,
      payform: { payInput },
      fetchInvoice
    } = this.props

    // If LN go retrieve invoice details
    if (prevProps.payform.payInput !== payInput && isLn) {
      fetchInvoice(payInput)
    }
  }

  render() {
    const {
      payform: { payInput, showErrors, invoice, showCurrencyFilters },
      nodes,
      ticker,

      isOnchain,
      isLn,
      currentAmount,
      fiatAmount,
      payFormIsValid: { errors, isValid },
      currentCurrencyFilters,
      currencyName,

      setPayAmount,
      onPayAmountBlur,

      setPayInput,
      onPayInputBlur,

      setCurrencyFilters,

      onPaySubmit,

      setCurrency,
      intl
    } = this.props

    const displayNodeName = pubkey => {
      const node = nodes.find(n => n.pub_key === pubkey)

      if (node && node.alias.length) {
        return node.alias
      }

      return pubkey ? pubkey.substring(0, 10) : ''
    }

    const onCurrencyFilterClick = currency => {
      if (!isLn) {
        // change the input amount
        setPayAmount(btc.convert(ticker.currency, currency, currentAmount))
      }

      setCurrency(currency)
      setCurrencyFilters(false)
    }

    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <Isvg src={paperPlane} />
          <h1>
            <FormattedMessage {...messages.title} />
          </h1>
        </header>

        <div className={styles.content}>
          <section className={styles.destination}>
            <div className={styles.top}>
              <label htmlFor="paymentRequest">
                <FormattedMessage {...messages.destination} />
              </label>
              <span
                className={`${styles.description} ${isOnchain || isLn ? styles.active : undefined}`}
              >
                {isOnchain && (
                  <i>
                    <Isvg src={link} />
                    <span>
                      <FormattedMessage {...messages.onchain_description} />
                    </span>
                  </i>
                )}
                {isLn && (
                  <i>
                    <span>
                      {displayNodeName(invoice.destination)} ({invoice.description})
                    </span>
                  </i>
                )}
              </span>
            </div>
            <div className={styles.bottom}>
              <textarea
                type="text"
                placeholder={intl.formatMessage({ ...messages.request_placeholder })}
                value={payInput}
                onChange={event => setPayInput(event.target.value)}
                onBlur={onPayInputBlur}
                id="paymentRequest"
                rows="4"
              />
              <section
                className={`${styles.errorMessage} ${
                  showErrors.payInput ? styles.active : undefined
                }`}
              >
                {showErrors.payInput && <span>{errors.payInput}</span>}
              </section>
            </div>
          </section>

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
                amount={currentAmount}
                currency={ticker.currency}
                onChangeEvent={setPayAmount}
                onBlurEvent={onPayAmountBlur}
                readOnly={isLn}
              />
              <div className={styles.currency}>
                <section
                  className={styles.currentCurrency}
                  onClick={() => setCurrencyFilters(!showCurrencyFilters)}
                >
                  <span>{currencyName}</span>
                  <span>
                    <MdKeyboardArrowDown />
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

            <div className={styles.fiatAmount}>{`≈ ${fiatAmount || 0} ${ticker.fiatTicker}`}</div>

            <section
              className={`${styles.errorMessage} ${styles.amount} ${
                showErrors.amount ? styles.active : undefined
              }`}
            >
              {showErrors.amount && <span>{errors.amount}</span>}
            </section>
          </section>

          <section className={styles.submit}>
            <div
              className={`${styles.button} ${isValid ? styles.active : undefined}`}
              onClick={onPaySubmit}
            >
              <FormattedMessage {...messages.pay} />
            </div>
          </section>
        </div>
      </div>
    )
  }
}

Pay.propTypes = {
  payform: PropTypes.shape({
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    payInput: PropTypes.string.isRequired,
    invoice: PropTypes.object.isRequired,
    showErrors: PropTypes.object.isRequired
  }).isRequired,
  currencyName: PropTypes.string.isRequired,

  isOnchain: PropTypes.bool.isRequired,
  isLn: PropTypes.bool.isRequired,
  currentAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  fiatAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  payFormIsValid: PropTypes.shape({
    errors: PropTypes.object,
    isValid: PropTypes.bool
  }).isRequired,

  setPayAmount: PropTypes.func.isRequired,
  onPayAmountBlur: PropTypes.func.isRequired,
  setPayInput: PropTypes.func.isRequired,
  onPayInputBlur: PropTypes.func.isRequired,
  fetchInvoice: PropTypes.func.isRequired,

  onPaySubmit: PropTypes.func.isRequired,
  setCurrencyFilters: PropTypes.func.isRequired,
  setCurrency: PropTypes.func.isRequired,

  ticker: PropTypes.object.isRequired,

  nodes: PropTypes.array.isRequired,
  currentCurrencyFilters: PropTypes.array.isRequired
}

export default injectIntl(Pay)
