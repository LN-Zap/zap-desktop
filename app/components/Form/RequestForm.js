import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CurrencyIcon from 'components/CurrencyIcon'
import styles from './RequestForm.scss'

class RequestForm extends Component {
  constructor(props) {
    super(props)
    this.state = { scrollWidth: 0 }
  }

  componentDidMount() {
    // After amountGhostInput is rendered, set scrollWidth
    this.setState({ scrollWidth: this.amountGhostInput.scrollWidth })
  }

  componentDidUpdate(prevProps, prevState) {
    // If the with of the ghost input has changed, update the scrollWith
    if (prevState.scrollWidth !== this.amountGhostInput.scrollWidth) {
      this.setState({ scrollWidth: this.amountGhostInput.scrollWidth })
    }
  }

  render() {
    const {
      requestform: { amount, memo },
      currency,
      crypto,

      setRequestAmount,
      setRequestMemo,

      onRequestSubmit
    } = this.props

    const { scrollWidth } = this.state
    const sqrt = amount.length ** 2
    const fontSize = `${190 - sqrt}px`

    return (
      <div className={styles.container}>
        <section className={styles.amountContainer}>
          <span
            className={styles.ghostInput}
            ref={(input) => {
              this.amountGhostInput = input
            }}
            style={{ fontSize }}
          >
            {this.amountInput && this.amountInput.value !== '' ? this.amountInput.value : 0}
          </span>
          <label htmlFor='amount'>
            <CurrencyIcon currency={currency} crypto={crypto} />
          </label>
          <input
            type='number'
            min='0'
            ref={input => (this.amountInput = input)} // eslint-disable-line
            size=''
            style={{ width: `${scrollWidth + 40}px`, fontSize }}
            value={amount}
            onChange={event => setRequestAmount(event.target.value)}
            id='amount'
            onBlur={(event) => {
              if (event.target.value === '') {
                setRequestAmount('0')
              }
            }}
          />
        </section>
        <section className={styles.inputContainer}>
          <label htmlFor='memo'>Request:</label>
          <input type='text' placeholder='Dinner, Rent, etc' value={memo} onChange={event => setRequestMemo(event.target.value)} id='memo' />
        </section>
        <section className={styles.buttonGroup}>
          <div className={`buttonPrimary ${styles.button}`} onClick={onRequestSubmit}>
            Request
          </div>
        </section>
      </div>
    )
  }
}

RequestForm.propTypes = {
  requestform: PropTypes.object.isRequired,
  currency: PropTypes.string.isRequired,
  crypto: PropTypes.string.isRequired,

  setRequestAmount: PropTypes.func.isRequired,
  setRequestMemo: PropTypes.func.isRequired,

  onRequestSubmit: PropTypes.func.isRequired
}

export default RequestForm
