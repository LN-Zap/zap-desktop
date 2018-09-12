import React from 'react'
import PropTypes from 'prop-types'
import FaAngleRight from 'react-icons/lib/fa/angle-right'
import styles from './Menu.scss'

const Menu = ({ setActiveSubMenu }) => (
  <ul>
    <li className={styles.fiat} onClick={() => setActiveSubMenu('fiat')}>
      <span>Fiat Currency</span>
      <FaAngleRight />
    </li>
  </ul>
)

Menu.propTypes = {
  setActiveSubMenu: PropTypes.func.isRequired
}

export default Menu
