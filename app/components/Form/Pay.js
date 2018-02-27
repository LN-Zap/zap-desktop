import React, { Component } from 'react'
import PropTypes from 'prop-types'
import find from 'lodash/find'

import Isvg from 'react-inlinesvg'
import paperPlane from 'icons/paper_plane.svg'
import link from 'icons/link.svg'
import { FaAngleDown } from 'react-icons/lib/fa'

import { btc } from 'utils'
import LoadingBolt from 'components/LoadingBolt'

import styles from './Pay.scss'

class Pay extends Component {
  componentDidUpdate(prevProps) {
    const {
      isOnchain, isLn, payform: { payInput }, fetchInvoice
    } = this.props

    // If on-chain, focus on amount to let user know it's editable
    if (isOnchain) { this.amountInput.focus() }

    // If LN go retrieve invoice details
    if ((prevProps.payform.payInput !== payInput) && isLn) {
      fetchInvoice(payInput)
    }
  }

  render() {
    const {
      payform: {
        payInput,
        showErrors,
        invoice,
        showCurrencyFilters
      },
      nodes,
      ticker,

      isOnchain,
      isLn,
      currentAmount,
      usdAmount,
      showPayLoadingScreen,
      payFormIsValid: { errors, isValid },
      currentCurrencyFilters,
      currencyName,

      setPayAmount,
      onPayAmountBlur,

      setPayInput,
      onPayInputBlur,

      setCurrencyFilters,

      onPaySubmit,

      setCurrency
    } = this.props

    console.log('errors: ', errors)
    console.log('showErrors: ', showErrors)

    const displayNodeName = (pubkey) => {
      const node = find(nodes, n => n.pub_key === pubkey)

      if (node && node.alias.length) { return node.alias }

      return pubkey.substring(0, 10)
    }

    const onCurrencyFilterClick = (currency) => {
      if (!isLn) {
        // change the input amount
        setPayAmount(btc.convert(ticker.currency, currency, currentAmount))
      }

      setCurrency(currency)
      setCurrencyFilters(false)
    }

    return (
      <div className={styles.container}>
        {showPayLoadingScreen && <LoadingBolt />}
        <header className={styles.header}>
          <Isvg src={paperPlane} />
          <h1>Make Payment</h1>
        </header>

        <div className={styles.content}>
          <section className={styles.destination}>
            <div className={styles.top}>
              <label htmlFor='destination'>Destination</label>
              <span className={`${styles.description} ${(isOnchain || isLn) && styles.active}`}>
                {isOnchain &&
                  <i>
                    <Isvg src={link} />
                    <span>On-Chain (~10 minutes)</span>
                  </i>
                }
                {isLn &&
                  <i>
                    <span>
                      {displayNodeName(invoice.destination)} ({invoice.description})
                    </span>
                  </i>
                }
              </span>
            </div>
            <div className={styles.bottom}>
              <textarea
                type='text'
                placeholder='Payment request or bitcoin address'
                value={payInput}
                onChange={event => setPayInput(event.target.value)}
                onBlur={onPayInputBlur}
                id='destination'
                rows='2'
              />
              <section className={`${styles.errorMessage} ${showErrors.payInput && styles.active}`}>
                {showErrors.payInput &&
                  <span>{errors.payInput}</span>
                }
              </section>
            </div>
          </section>

          <section className={styles.amount}>
            <div className={styles.top}>
              <label htmlFor='amount'>Amount</label>
              <span />
            </div>
            <div className={styles.bottom}>
              <input
                type='number'
                min='0'
                ref={(input) => { this.amountInput = input }}
                size=''
                placeholder='0.00000000'
                value={currentAmount || ''}
                onChange={event => setPayAmount(event.target.value)}
                onBlur={onPayAmountBlur}
                id='amount'
                readOnly={isLn}
              />
              <div className={styles.currency}>
                <section className={styles.currentCurrency} onClick={() => setCurrencyFilters(!showCurrencyFilters)}>
                  <span>{currencyName}</span><span><FaAngleDown /></span>
                </section>
                <ul className={showCurrencyFilters && styles.active}>
                  {
                    currentCurrencyFilters.map(filter =>
                      <li key={filter.key} onClick={() => onCurrencyFilterClick(filter.key)}>{filter.name}</li>)
                  }
                </ul>
              </div>
            </div>

            <div className={styles.usdAmount}>
              {`≈ ${usdAmount || 0} USD`}
            </div>

            <section className={`${styles.errorMessage} ${styles.amount} ${showErrors.amount && styles.active}`}>
              {showErrors.amount &&
                <span>{errors.amount}</span>
              }
            </section>
          </section>

          <section className={styles.submit}>
            <div className={`${styles.button} ${isValid && styles.active}`} onClick={onPaySubmit}>Pay</div>
          </section>
        </div>
      </div>
    )
  }
}


Pay.propTypes = {
  payform: PropTypes.shape({
    amount: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    payInput: PropTypes.string.isRequired,
    showErrors: PropTypes.object.isRequired
  }).isRequired,
  currencyName: PropTypes.string.isRequired,

  isOnchain: PropTypes.bool.isRequired,
  isLn: PropTypes.bool.isRequired,
  currentAmount: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  usdAmount: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  showPayLoadingScreen: PropTypes.bool.isRequired,
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

export default Pay
