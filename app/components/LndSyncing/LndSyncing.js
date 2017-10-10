import React from 'react'
import styles from './LndSyncing.scss'

const LndSyncing = ({ lines }) => (
  <div className={styles.container}>
    <h3>zap</h3>
    <div className={styles.loading}>
      <div className={styles.spinner}></div>
      <h1>syncing your lightning node to the blockchain</h1>
    </div>
  </div>
)

export default LndSyncing
