import React from 'react'
import PropTypes from 'prop-types'

import FaAngleDown from 'react-icons/lib/fa/angle-down'

import styles from './SubmitChannelForm.scss'

class SubmitChannelForm extends React.Component {
  render() {
    const {
      closeChannelForm,
      closeContactsForm,

      node,
      contactCapacity,
      updateContactCapacity,
      openChannel,

      toggleCurrencyProps: {
        setContactsCurrencyFilters,
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
      }

      return node.pub_key
    }

    const formSubmitted = () => {
      // dont submit to LND if they havent set channel capacity amount
      if (contactCapacity <= 0) {
        return
      }

      // submit the channel to LND
      openChannel({
        pubkey: node.pub_key,
        host: node.addresses[0].addr,
        local_amt: contactCapacity
      })

      // close the ChannelForm component
      closeChannelForm()

      // close the AddChannel component
      closeContactsForm()
    }

    return (
      <div className={styles.content}>
        <header className={styles.header}>
          <h1>Add Funds to Network</h1>
          <p>
            Opening a channel will help you send and receive money on the Lightning Network. You
            aren&apos;t spending any money, rather moving the money you plan to use onto the
            network.
          </p>
        </header>

        <section className={styles.title}>
          <h2>{renderTitle()}</h2>
        </section>

        <section className={styles.amount}>
          <div className={styles.input}>
            <input
              type="number"
              min="0"
              size=""
              placeholder="0.00000000"
              value={contactCapacity || ''}
              onChange={event => updateContactCapacity(event.target.value)}
              id="amount"
            />
            <div className={styles.currency}>
              <section
                className={styles.currentCurrency}
                onClick={() => setContactsCurrencyFilters(!showCurrencyFilters)}
              >
                <span>{currencyName}</span>
                <span>
                  <FaAngleDown />
                </span>
              </section>
              <ul className={showCurrencyFilters && styles.active}>
                {currentCurrencyFilters.map(filter => (
                  <li key={filter.key} onClick={() => onCurrencyFilterClick(filter.key)}>
                    {filter.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.usdAmount}>{`≈ ${contactFormUsdAmount || 0} USD`}</div>
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

SubmitChannelForm.propTypes = {
  closeChannelForm: PropTypes.func.isRequired,
  closeContactsForm: PropTypes.func.isRequired,

  node: PropTypes.object.isRequired,
  contactCapacity: PropTypes.PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  updateContactCapacity: PropTypes.func.isRequired,
  openChannel: PropTypes.func.isRequired,

  toggleCurrencyProps: PropTypes.object.isRequired
}

export default SubmitChannelForm
