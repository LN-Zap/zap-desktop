import React from 'react'
import PropTypes from 'prop-types'
import styles from './ConnectionConfirm.scss'

const ConnectionConfirm = ({ connectionHost }) => (
  <div className={styles.container}>
    <p>
      Are you sure you want to connect to{' '}
      <span className={styles.host}>{connectionHost.split(':')[0]}</span>?{' '}
    </p>
    <p>
      <strong>Please check the hostname carefully.</strong>
    </p>
  </div>
)

ConnectionConfirm.propTypes = {
  connectionHost: PropTypes.string.isRequired
}

export default ConnectionConfirm
