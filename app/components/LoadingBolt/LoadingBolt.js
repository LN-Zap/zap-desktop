import React from 'react'
import path from 'path'
import Isvg from 'react-inlinesvg'
import styles from './LoadingBolt.scss'

const LoadingBolt = () => (
  <div className={styles.container}>
    <div className={styles.content}>
      <Isvg className={styles.bolt} src={path.join(__dirname, '..', 'resources/cloudbolt.svg')} />
      <h1>loading</h1>
    </div>
  </div>
)

export default LoadingBolt
