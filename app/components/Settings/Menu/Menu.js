import React from 'react'
import PropTypes from 'prop-types'
import { MdKeyboardArrowRight } from 'react-icons/md'
import styles from './Menu.scss'

const Menu = ({ setActiveSubMenu }) => (
  <ul>
    <li className={styles.fiat} onClick={() => setActiveSubMenu('fiat')}>
      <span>Fiat Currency</span>
      <MdKeyboardArrowRight />
    </li>
    <li className={styles.language} onClick={() => setActiveSubMenu('language')}>
      <span>Language</span>
      <MdKeyboardArrowRight />
    </li>
  </ul>
)

Menu.propTypes = {
  setActiveSubMenu: PropTypes.func.isRequired
}

export default Menu
