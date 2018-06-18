import React from 'react'
import PropTypes from 'prop-types'
import { FaCircle, FaCircleThin } from 'react-icons/lib/fa'
import styles from './ConnectionType.scss'

const ConnectionType = ({ connectionType, setConnectionType }) => (
  <div className={styles.container}>
    <section className={`${styles.option} ${connectionType === 'local' && styles.active}`}>
      <div className={`${styles.button}`} onClick={() => setConnectionType('local')}>
        {connectionType === 'local' ? <FaCircle /> : <FaCircleThin />}
        <span className={styles.label}>Default</span>
      </div>
    </section>
    <section className={`${styles.option} ${connectionType === 'custom' && styles.active}`}>
      <div className={`${styles.button}`} onClick={() => setConnectionType('custom')}>
        {connectionType === 'custom' ? <FaCircle /> : <FaCircleThin />}
        <span className={styles.label}>Custom</span>
      </div>
    </section>
  </div>
)

ConnectionType.propTypes = {
  connectionType: PropTypes.string.isRequired,
  setConnectionType: PropTypes.func.isRequired,
}

export default ConnectionType
