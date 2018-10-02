import React from 'react'
import PropTypes from 'prop-types'

import FaAngleDown from 'react-icons/lib/fa/angle-down'
import FaExclamationCircle from 'react-icons/lib/fa/exclamation-circle'

import AmountInput from 'components/AmountInput'
import Button from 'components/UI/Button'

import { FormattedNumber, FormattedMessage } from 'react-intl'
import messages from './messages'

import styles from './SubmitChannelForm.scss'

class SubmitChannelForm extends React.Component {
  constructor(props) {
    super(props)
    this.amountInput = React.createRef()
  }

  componentDidMount() {
    // Clear and Focus the amount input field.
    this.amountInput.current.focusTextInput()
  }

  render() {
    const {
      closeChannelForm,
      closeContactsForm,

      node,
      contactCapacity,
      updateContactCapacity,
      openChannel,
      fiatTicker,
      dupeChanInfo,

      ticker,

      toggleCurrencyProps: {
        setContactsCurrencyFilters,
        showCurrencyFilters,
        currencyName,
        currentCurrencyFilters,
        onCurrencyFilterClick,
        contactFormFiatAmount
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

    const renderWarning = dupeChanInfo => {
      const { alias, activeChannels, capacity, currencyName } = dupeChanInfo
      const aliasMsg = alias ? <span className={styles.alias}>{alias}</span> : 'this_node'

      return (
        <p>
          <FormattedMessage
            {...messages.duplicate_warnig}
            values={{
              activeChannels,
              aliasMsg
            }}
          />{' '}
          {capacity} {currencyName}.
        </p>
      )
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
          <h1>
            <FormattedMessage {...messages.title} />
          </h1>
          <p>
            <FormattedMessage {...messages.description} />
          </p>
        </header>

        <section className={styles.title}>
          <h2>{renderTitle()}</h2>
        </section>

        {dupeChanInfo && (
          <section className={styles.warn}>
            <FaExclamationCircle className={styles.exclamation} style={{ verticalAlign: 'top' }} />
            {renderWarning(dupeChanInfo)}
          </section>
        )}

        <section className={styles.amount}>
          <div className={styles.input}>
            <AmountInput
              id="amount"
              amount={contactCapacity}
              currency={ticker.currency}
              onChangeEvent={updateContactCapacity}
              ref={this.amountInput}
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
              <ul className={showCurrencyFilters ? styles.active : undefined}>
                {currentCurrencyFilters.map(filter => (
                  <li key={filter.key} onClick={() => onCurrencyFilterClick(filter.key)}>
                    {filter.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className={styles.fiatAmount}>
            {'≈ '}
            <FormattedNumber
              currency={fiatTicker}
              style="currency"
              value={contactFormFiatAmount || 0}
            />
          </div>
        </section>

        <section className={styles.submit}>
          <Button disabled={!(contactCapacity > 0)} onClick={formSubmitted} size="large">
            <FormattedMessage {...messages.submit} />
          </Button>
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
  fiatTicker: PropTypes.string.isRequired,
  dupeChanInfo: PropTypes.object,

  ticker: PropTypes.object.isRequired,

  toggleCurrencyProps: PropTypes.object.isRequired
}

export default SubmitChannelForm
