import React from 'react'
import PropTypes from 'prop-types'
import FaCircle from 'react-icons/lib/fa/circle'
import FaCircleThin from 'react-icons/lib/fa/circle-thin'
import { FormattedMessage } from 'react-intl'
import messages from './messages'
import styles from './Autopilot.scss'

const Autopilot = ({ autopilot, setAutopilot }) => (
  <div className={styles.container}>
    <section className={`${styles.enable} ${autopilot ? styles.active : undefined}`}>
      <div onClick={() => setAutopilot(true)}>
        {autopilot ? <FaCircle /> : <FaCircleThin />}
        <span className={styles.label}>
          <FormattedMessage {...messages.enable} />
        </span>
      </div>
    </section>
    <section
      className={`${styles.disable} ${
        !autopilot && autopilot !== null ? styles.active : undefined
      }`}
    >
      <div onClick={() => setAutopilot(false)}>
        {!autopilot && autopilot !== null ? <FaCircle /> : <FaCircleThin />}
        <span className={styles.label}>
          <FormattedMessage {...messages.disable} />
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
