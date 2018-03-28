import React from 'react'
import PropTypes from 'prop-types'

import { FaAngleDown } from 'react-icons/lib/fa'
import Isvg from 'react-inlinesvg'
import x from 'icons/x.svg'

import styles from './SubmitChannelForm.scss'

class SubmitChannelForm extends React.Component {
  render() {
    const {
      submitChannelFormOpen,
      closeSubmitChannelForm,

      pubkey,
      contactCapacity,
      updateContactCapacity,

      toggleCurrencyProps: {
        setContactsCurrencyFilters,
        setCurrencyFilters,
        showCurrencyFilters,
        currencyName,
        currentCurrencyFilters,
        onCurrencyFilterClick,
        contactFormUsdAmount
      }
    } = this.props

    if (!submitChannelFormOpen) { return null }

    return (
      <div className={styles.container}>
        <div className={styles.closeContainer}>
          <span onClick={closeSubmitChannelForm}>
            <Isvg src={x} />
          </span>
        </div>
        
        <div className={styles.content}>
          <header className={styles.header}>
            <h1>Add Funds to Network</h1>
            <p>Adding a connection will help you send and receive money on the Lightning Network. You aren't spening any money, rather moving the money you plan to use onto the network.</p>
          </header>

          <section className={styles.title}>
            <h2>{pubkey}</h2>
          </section>

          <section className={styles.amount}>
            <div className={styles.input}>
              <input
                type='number'
                min='0'
                ref={(input) => { this.amountInput = input }}
                size=''
                placeholder='0.00000000'
                value={contactCapacity || ''}
                onChange={event => updateContactCapacity(event.target.value)}
                // onBlur={onPayAmountBlur}
                id='amount'
              />
              <div className={styles.currency}>
                <section className={styles.currentCurrency} onClick={() => setContactsCurrencyFilters(!showCurrencyFilters)}>
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
              {`≈ ${contactFormUsdAmount || 0} USD`}
            </div>
          </section>
        </div>
      </div>
    )
  }
}

SubmitChannelForm.propTypes = {}

export default SubmitChannelForm
