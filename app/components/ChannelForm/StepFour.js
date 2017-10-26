import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CurrencyIcon from 'components/CurrencyIcon'
import styles from './StepFour.scss'

class StepFour extends Component {
  render() {
    const { node_key, local_amt, push_amt } = this.props

    return (
      <div className={styles.container}>
        <div className={styles.nodekey}>
          <h4>Peer</h4>
          <h2>{node_key}</h2>
        </div>

        <div className={styles.amounts}>
          <div className={styles.localamt}>
            <h4>Local Amount</h4>
            <h3>{local_amt}</h3>
          </div>
          <div className={styles.pushamt}>
            <h4>Push Amount</h4>
            <h3>{push_amt}</h3>
          </div>
        </div>
      </div>
    )
  }
}

StepFour.propTypes = {}

export default StepFour
