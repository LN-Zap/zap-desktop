import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Isvg from 'react-inlinesvg'
import zapLogo from 'icons/zap_logo.svg'
import styles from './Alias.scss'

const Alias = ({ alias, setAlias }) => {
  console.log('alias: ', alias)
  console.log('setAlias: ', setAlias)
  
  return (
    <div className={styles.container}>
      <input
        type='text'
        placeholder='Satoshi'
        className={styles.alias}
        ref={input => input && input.focus()}
      />
    </div>
  )
}

Alias.propTypes = {}

export default Alias