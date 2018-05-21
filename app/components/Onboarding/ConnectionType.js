import React from 'react'
import PropTypes from 'prop-types'
import { FaCircle, FaCircleThin } from 'react-icons/lib/fa'
import styles from './ConnectionType.scss'

const ConnectionType = ({ connectionType, setConnectionType }) => (
  <div className={styles.container}>
    <section className={`${styles.option} ${connectionType === 'local' && styles.active}`}>
      <div className={`${styles.button}`} onClick={() => setConnectionType('local')}>
        {connectionType === 'local' ? <FaCircle /> : <FaCircleThin />}
        <span className={styles.label}>Automatic</span>
      </div>
      <div className={`${styles.description}`}>
        In automatic mode, we will check your local machine to see if you already have a Lightning node running.
        If so, we will try to use it. If not, we will start up a light-weight neutrino node for you.
      </div>
    </section>
    <section className={`${styles.option} ${connectionType === 'custom' && styles.active}`}>
      <div className={`${styles.button}`} onClick={() => setConnectionType('custom')}>
        {connectionType === 'custom' ? <FaCircle /> : <FaCircleThin />}
        <span className={styles.label}>Custom</span>
      </div>
      <div className={`${styles.description}`}>
        Connect to a remote Lightning node or a node running in a non-standard location (advanced users only).
      </div>
    </section>
  </div>
)

ConnectionType.propTypes = {
  connectionType: PropTypes.string.isRequired,
  setConnectionType: PropTypes.func.isRequired
}

export default ConnectionType
