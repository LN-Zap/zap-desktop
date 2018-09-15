import React from 'react'
import PropTypes from 'prop-types'
import { FaCircle, FaRegCircle } from 'react-icons/fa'
import { FormattedMessage } from 'react-intl'
import messages from './messages'
import styles from './Autopilot.scss'

const Autopilot = ({ autopilot, setAutopilot }) => (
  <div className={styles.container}>
    <section className={`${styles.enable} ${autopilot ? styles.active : undefined}`}>
      <div onClick={() => setAutopilot(true)}>
        {autopilot ? <FaCircle /> : <FaRegCircle />}
        <span className={styles.label}>
          <FormattedMessage {...messages.enable} /> Autopilot
        </span>
      </div>
    </section>
    <section
      className={`${styles.disable} ${
        !autopilot && autopilot !== null ? styles.active : undefined
      }`}
    >
      <div onClick={() => setAutopilot(false)}>
        {!autopilot && autopilot !== null ? <FaCircle /> : <FaRegCircle />}
        <span className={styles.label}>
          <FormattedMessage {...messages.disable} /> Autopilot
        </span>
      </div>
    </section>
  </div>
)

Autopilot.propTypes = {
  autopilot: PropTypes.bool,
  setAutopilot: PropTypes.func.isRequired
}

export default Autopilot
