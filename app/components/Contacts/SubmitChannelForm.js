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
      closeChannelForm,
      closeContactsForm,

      node,
      contactCapacity,
      updateContactCapacity,
      openChannel,

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

    const renderTitle = () => {
      // if the node has an alias set we will show that with the pubkey in parens
      // if not, just show the pubkey (would look ugly with rando parens)
      if (node.alias && node.alias.length) {
        return `${node.alias} (${node.pub_key})`
      } else {
        return node.addresses
      }
    }

    const formSubmitted = () => {
      // submit the channel to LND
      openChannel({ pubkey: node.pub_key, host: node.addresses[0].addr, local_amt: contactCapacity })

      // close the ChannelForm component
      closeChannelForm()

      // close the AddChannel component
      closeContactsForm()
    }

    return (
      <div className={styles.content}>
        <header className={styles.header}>
          <h1>Add Funds to Network</h1>
          <p>Adding a connection will help you send and receive money on the Lightning Network. You aren't spening any money, rather moving the money you plan to use onto the network.</p>
        </header>

        <section className={styles.title}>
          <h2>{renderTitle()}</h2>
        </section>

        <section className={styles.amount}>
          <div className={styles.input}>
            <input
              type='number'
              min='0'
              size=''
              placeholder='0.00000000'
              value={contactCapacity || ''}
              onChange={event => updateContactCapacity(event.target.value)}
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

        <section className={styles.submit}>
          <div
            className={`${styles.button} ${contactCapacity > 0 && styles.active}`}
            onClick={formSubmitted}
          >
            Submit
          </div>
        </section>
      </div>
    )
  }
}

SubmitChannelForm.propTypes = {}

export default SubmitChannelForm
