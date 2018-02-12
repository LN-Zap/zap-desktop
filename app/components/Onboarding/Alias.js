import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Isvg from 'react-inlinesvg'
import zapLogo from 'icons/zap_logo.svg'
import styles from './Alias.scss'

const Alias = ({ alias, updateAlias }) => (
  <div className={styles.container}>
    <input
      type='text'
      placeholder='Satoshi'
      className={styles.alias}
      ref={input => input && input.focus()}
      value={alias}
      onChange={event => updateAlias(event.target.value)}
    />
  </div>
)

Alias.propTypes = {
  alias: PropTypes.string.isRequired,
  updateAlias: PropTypes.func.isRequired
}

export default Alias