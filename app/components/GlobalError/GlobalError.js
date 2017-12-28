import React from 'react'
import PropTypes from 'prop-types'
import { MdClose } from 'react-icons/lib/md'
import styles from './GlobalError.scss'

const GlobalError = ({ error, clearError }) => {
  setTimeout(clearError, 10000)

  return (
    <div className={`${styles.container} ${!error && styles.closed}`}>
      <div className={styles.content}>
        <div className={styles.close} onClick={clearError}>
          <MdClose />
        </div>
        <h2>{error}</h2>
      </div>
    </div>
  )
}


GlobalError.propTypes = {
  error: PropTypes.string,
  clearError: PropTypes.func.isRequired
}

export default GlobalError
