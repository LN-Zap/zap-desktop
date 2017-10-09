import React from 'react'
import PropTypes from 'prop-types'
import AnimatedCheckmark from 'components/AnimatedCheckmark'
import styles from './SuccessfulSendPayment.scss'

const SuccessfulSendPayment = ({ hideModal }) => (
  <div className={styles.container}>
    <AnimatedCheckmark />
    <h1>
      <span>Successfully sent payment</span>&nbsp;
    </h1>
    <div className={styles.button} onClick={hideModal}>
        Done
    </div>
  </div>
)

SuccessfulSendPayment.propTypes = {
  hideModal: PropTypes.func.isRequired
}

export default SuccessfulSendPayment
