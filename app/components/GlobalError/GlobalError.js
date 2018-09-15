import React from 'react'
import PropTypes from 'prop-types'
import { MdClose } from 'react-icons/md'
import errorToUserFriendly from 'lib/utils/userFriendlyErrors'
import styles from './GlobalError.scss'

class GlobalError extends React.Component {
  componentDidUpdate(prevProps) {
    const { clearError, error } = this.props
    if (!prevProps.error && error) {
      setTimeout(clearError, 10000)
    }
  }

  render() {
    const { error, clearError } = this.props

    return (
      <div className={`${styles.container} ${!error ? styles.closed : undefined}`}>
        <div className={styles.content}>
          <div className={styles.close} onClick={clearError}>
            <MdClose />
          </div>
          <h2>{errorToUserFriendly(error)}</h2>
        </div>
      </div>
    )
  }
}

GlobalError.propTypes = {
  error: PropTypes.string,
  clearError: PropTypes.func.isRequired
}

export default GlobalError
