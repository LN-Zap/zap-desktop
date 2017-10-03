import React from 'react'
import PropTypes from 'prop-types'
import styles from './GlobalError.scss'

const GlobalError = ({ error }) => {
  console.log('error: ', error)
  if (!error) { return null }
  return (
    <div className={styles.container}>
      <h2>{error}</h2>
    </div>
  )
}

GlobalError.propTypes = {}

export default GlobalError
