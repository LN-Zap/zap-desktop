import React from 'react'
import PropTypes from 'prop-types'
import styles from './StepFour.scss'

const StepFour = ({ node_key, local_amt, push_amt }) => (
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

StepFour.propTypes = {
  node_key: PropTypes.string.isRequired,
  local_amt: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
  push_amt: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ])
}

export default StepFour
