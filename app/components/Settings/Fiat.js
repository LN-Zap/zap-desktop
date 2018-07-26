import React from 'react'
import PropTypes from 'prop-types'
import FaAngleLeft from 'react-icons/lib/fa/angle-left'
import styles from './Fiat.scss'

const Fiat = ({ disableSubMenu }) => {
  return (
    <div>
      <header className={styles.submenuHeader} onClick={disableSubMenu}>
        <FaAngleLeft />
        <span>Fiat currency</span>
      </header>
      <ul>
        <li>USD</li>
        <li>JPY</li>
        <li>CNY</li>
        <li>SGD</li>
        <li>HKD</li>
        <li>CAD</li>
      </ul>
    </div>
  )
}

Fiat.propTypes = {
  disableSubMenu: PropTypes.func.isRequired
}

export default Fiat
