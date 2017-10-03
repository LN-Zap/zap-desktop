import React from 'react'
import PropTypes from 'prop-types'
import styles from './GlobalError'

const GlobalError = ({ error }) => {
  console.log('error: ', error)
  return (
    <div>
      yo global error mf
    </div>
  )
}

GlobalError.propTypes = {}

export default GlobalError
